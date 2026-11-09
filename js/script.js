// Adiciona interações acessíveis à navegação da página, sem dependências.
const botaoMenu = document.querySelector('.menu-alternar');
const navegacaoPrincipal = document.querySelector('#navegacao-principal');
const cabecalho = document.querySelector('.cabecalho');
const consultaCelular = window.matchMedia('(max-width: 680px)');

/** Atualiza o estado visual e acessível do menu móvel. */
function definirMenuAberto(aberto) {
  if (!botaoMenu || !navegacaoPrincipal) return;

  botaoMenu.setAttribute('aria-expanded', String(aberto));
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  navegacaoPrincipal.classList.toggle('navegacao--aberta', aberto);
}

if (botaoMenu && navegacaoPrincipal) {
  botaoMenu.addEventListener('click', () => {
    const menuEstaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';
    definirMenuAberto(!menuEstaAberto);
  });

  // Fecha o menu depois da escolha de uma seção.
  navegacaoPrincipal.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) definirMenuAberto(false);
  });

  // Fecha ao tocar fora do menu ou pressionar Escape.
  document.addEventListener('click', (evento) => {
    const menuEstaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';
    const cliqueDentroDoMenu = navegacaoPrincipal.contains(evento.target) || botaoMenu.contains(evento.target);

    if (menuEstaAberto && !cliqueDentroDoMenu) definirMenuAberto(false);
  });

  document.addEventListener('keydown', (evento) => {
    const menuEstaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';

    if (evento.key === 'Escape' && menuEstaAberto) {
      definirMenuAberto(false);
      botaoMenu.focus();
    }
  });

  // Garante que a navegação não permaneça aberta ao ampliar a janela.
  consultaCelular.addEventListener('change', (evento) => {
    if (!evento.matches) definirMenuAberto(false);
  });
}

// Destaca no menu a seção que está sendo consultada.
const secoesNavegaveis = ['projeto', 'experiencias', 'datas', 'contato']
  .map((identificador) => document.getElementById(identificador))
  .filter(Boolean);

function destacarSecao(identificadorAtivo) {
  document.querySelectorAll('#navegacao-principal a[href^="#"]').forEach((link) => {
    if (link.getAttribute('href') === `#${identificadorAtivo}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

if ('IntersectionObserver' in window && secoesNavegaveis.length > 0) {
  const observadorDeSecoes = new IntersectionObserver((entradas) => {
    const secaoVisivel = entradas
      .filter((entrada) => entrada.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (secaoVisivel) destacarSecao(secaoVisivel.target.id);
  }, {
    rootMargin: '-25% 0px -60% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });

  secoesNavegaveis.forEach((secao) => observadorDeSecoes.observe(secao));
}

// Adiciona uma indicação discreta quando o cabeçalho deixa o topo da página.
if (cabecalho) {
  const atualizarEstadoDoCabecalho = () => {
    cabecalho.classList.toggle('cabecalho--rolado', window.scrollY > 12);
  };

  atualizarEstadoDoCabecalho();
  window.addEventListener('scroll', atualizarEstadoDoCabecalho, { passive: true });
}

// Escapa caracteres reservados pelo formato de calendário iCalendar.
function escaparTextoDoCalendario(texto) {
  return texto
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// Cria um arquivo .ics com o horário local de Manaus convertido para UTC.
function baixarEventoDoCalendario(cartao) {
  const dataDoEvento = cartao.querySelector('time[datetime]')?.dateTime;
  const unidade = cartao.querySelector('h3')?.textContent.trim();
  const local = cartao.querySelector('.cartao-data__local')?.textContent.trim();

  if (!dataDoEvento || !unidade || !local) return;

  const inicio = new Date(`${dataDoEvento}T18:30:00-04:00`);
  const termino = new Date(`${dataDoEvento}T21:30:00-04:00`);
  const formatarDataUtc = (data) => data.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const identificador = `${dataDoEvento}-${unidade.toLowerCase().replace(/\s+/g, '-')}`;
  const conteudoCalendario = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UNIESBAM//Cultura Afro e Indigena 2026//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${identificador}@esbam.edu.br`,
    `DTSTAMP:${formatarDataUtc(new Date())}`,
    `DTSTART:${formatarDataUtc(inicio)}`,
    `DTEND:${formatarDataUtc(termino)}`,
    `SUMMARY:${escaparTextoDoCalendario(`Cultura Afro e Indígena — ${unidade}`)}`,
    `LOCATION:${escaparTextoDoCalendario(`${unidade} — ${local}, Manaus, AM`)}`,
    `DESCRIPTION:${escaparTextoDoCalendario('Encontro do evento Cultura Afro e Indígena — Lutas e Conquistas, da UNIESBAM.')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const arquivo = new Blob([conteudoCalendario], { type: 'text/calendar;charset=utf-8' });
  const enderecoTemporario = URL.createObjectURL(arquivo);
  const linkDeDownload = document.createElement('a');
  linkDeDownload.href = enderecoTemporario;
  linkDeDownload.download = `uniesbam-${identificador}.ics`;
  linkDeDownload.hidden = true;
  document.body.append(linkDeDownload);
  linkDeDownload.click();
  linkDeDownload.remove();
  window.setTimeout(() => URL.revokeObjectURL(enderecoTemporario), 1000);
}

// Acrescenta uma ação de calendário a cada cartão sem duplicar dados no HTML.
document.querySelectorAll('.cartao-data').forEach((cartao) => {
  const unidade = cartao.querySelector('h3')?.textContent.trim();
  if (!unidade) return;

  const botaoCalendario = document.createElement('button');
  botaoCalendario.className = 'botao-calendario';
  botaoCalendario.type = 'button';
  botaoCalendario.textContent = 'Adicionar ao calendário';
  botaoCalendario.setAttribute('aria-label', `Baixar evento de ${unidade} para o calendário`);
  botaoCalendario.addEventListener('click', () => baixarEventoDoCalendario(cartao));
  cartao.querySelector('.cartao-data__conteudo')?.append(botaoCalendario);
});

// Revela blocos editoriais conforme entram na tela, com atraso leve entre cards.
if ('IntersectionObserver' in window) {
  const elementosRevelados = document.querySelectorAll(
    '.hero__texto, .hero__arte, .manifesto__interno, .projeto__imagem, .projeto__texto, .cartao-data, .cartao-experiencia, .convite__arte, .convite__texto, .rodape__grade > *',
  );

  const observadorDeRevelacao = new IntersectionObserver((entradas, observador) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      entrada.target.classList.add('revelar--visivel');
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  elementosRevelados.forEach((elemento, indice) => {
    elemento.classList.add('revelar');
    if (elemento.matches('.cartao-data, .cartao-experiencia')) {
      elemento.style.setProperty('--atraso-revelar', `${(indice % 4) * 65}ms`);
    }
    observadorDeRevelacao.observe(elemento);
  });
}
