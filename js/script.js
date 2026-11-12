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

// Parallax sutil na imagem do hero indígena em dispositivos com mouse.
const heroIndigena = document.querySelector('.ind-hero');
if (heroIndigena && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const imagemHero = heroIndigena.querySelector('.ind-hero__personagem');
  let quadroHero = 0;

  heroIndigena.addEventListener('pointermove', (evento) => {
    if (quadroHero) return;
    quadroHero = window.requestAnimationFrame(() => {
      const area = heroIndigena.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (evento.clientX - area.left) / area.width));
      const y = Math.max(0, Math.min(1, (evento.clientY - area.top) / area.height));
      heroIndigena.style.setProperty('--hero-luz-x', `${x * 100}%`);
      heroIndigena.style.setProperty('--hero-luz-y', `${y * 100}%`);
      imagemHero?.style.setProperty('--hero-parallax-x', `${(x - .5) * -12}px`);
      imagemHero?.style.setProperty('--hero-parallax-y', `${(y - .5) * -10}px`);
      quadroHero = 0;
    });
  });

  heroIndigena.addEventListener('pointerleave', () => {
    heroIndigena.style.removeProperty('--hero-luz-x');
    heroIndigena.style.removeProperty('--hero-luz-y');
    imagemHero?.style.removeProperty('--hero-parallax-x');
    imagemHero?.style.removeProperty('--hero-parallax-y');
  });
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
  linkDeDownload.setAttribute('aria-hidden', 'true');
  linkDeDownload.style.position = 'fixed';
  linkDeDownload.style.left = '-9999px';
  linkDeDownload.style.width = '1px';
  linkDeDownload.style.height = '1px';
  linkDeDownload.style.opacity = '0';
  document.body.append(linkDeDownload);
  linkDeDownload.click();
  linkDeDownload.remove();
  window.setTimeout(() => URL.revokeObjectURL(enderecoTemporario), 60000);
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
    '.hero__texto, .hero__arte, .manifesto__interno, .projeto__imagem, .projeto__texto, .cartao-data, .cartao-experiencia, .chamado-museu__cartao, .convite__arte, .convite__texto, .historias__abertura, .historias__nota, .historia-card, .rodape__grade > *',
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
    if (elemento.matches('.cartao-data, .cartao-experiencia, .historia-card')) {
      elemento.style.setProperty('--atraso-revelar', `${(indice % 4) * 65}ms`);
    }
    observadorDeRevelacao.observe(elemento);
  });
}

// Abre um chatbot local com respostas sobre o encontro, o museu e o WhatsApp.
const atalhoChat = document.querySelector('.atalho-chat');
const painelChat = document.querySelector('#painel-chat');
const mensagensChat = painelChat?.querySelector('.painel-chat__mensagens');
const formularioChat = painelChat?.querySelector('.painel-chat__formulario');
const campoChat = painelChat?.querySelector('#mensagem-chat');
const botaoFecharChat = painelChat?.querySelector('.painel-chat__fechar');

function acrescentarMensagem(texto, autor, html) {
  if (!mensagensChat) return;
  const balao = document.createElement('p');
  balao.className = `painel-chat__balao painel-chat__balao--${autor}`;
  if (html) balao.innerHTML = html;
  else balao.textContent = texto;
  mensagensChat.append(balao);
  mensagensChat.scrollTop = mensagensChat.scrollHeight;
}

function respostaDoChat(pergunta) {
  const texto = pergunta.toLocaleLowerCase('pt-BR');
  if (/muncab|afro-?brasileir|salvador|bahia/.test(texto)) {
    return { html: 'O Museu Nacional da Cultura Afro-Brasileira (MUNCAB) fica no Centro Hist\u00f3rico de Salvador (BA). <a href="https://www.muncab.com.br/" target="_blank" rel="noopener noreferrer">Abrir o site oficial do MUNCAB</a>.' };
  }
  if (/museu|gratui/.test(texto)) {
    return { html: 'O Museu das Culturas Ind\u00edgenas, em S\u00e3o Paulo, tem entrada gratuita para o p\u00fablico em geral \u00e0s quintas-feiras. Pessoas ind\u00edgenas entram sem custo todos os dias. <a href="https://museudasculturasindigenas.org.br/" target="_blank" rel="noopener noreferrer">Abrir o site oficial do museu</a>.' };
  }
  if (/povos? ind[i\u00ed]genas?|lideran[c\u00e7]a ind[i\u00ed]gena|yanomami|ticuna|guarani/.test(texto)) {
    return { html: 'Conhe\u00e7a hist\u00f3rias e trajet\u00f3rias de povos e lideran\u00e7as ind\u00edgenas. <a href="indigenas.html#historias">Ver hist\u00f3rias</a> ou <a href="indigenas.html#vozes">conhecer as vozes</a>.' };
  }
  if (/data|quando|hor[a\u00e1]rio|onde|local|adrian|vianorte|centro|programa/.test(texto)) {
    return { html: 'Consulte datas, hor\u00e1rios e endere\u00e7os dos encontros na <a href="index.html#datas">programa\u00e7\u00e3o completa</a>.' };
  }
  if (/marielle/.test(texto)) {
    return { html: 'Marielle Franco (1979\u20132018) foi soci\u00f3loga, feminista e vereadora do Rio de Janeiro. Negra e criada na Mar\u00e9, \u00e9 refer\u00eancia das lutas de mulheres negras, da popula\u00e7\u00e3o LGBTQIA+ e das favelas. <a href="negras.html#marielle">Abrir a hist\u00f3ria de Marielle</a>.' };
  }
  if (/whats|contato|telefone|falar/.test(texto)) {
    return { html: 'O WhatsApp da ESBAM \u00e9 o (92) 99267-3858. <a href="https://wa.me/5592992673858" target="_blank" rel="noopener noreferrer">Abrir conversa</a>.' };
  }
  if (/evento|projeto|maria|o que|sobre/.test(texto)) {
    return { html: 'Cultura Afro e Ind\u00edgena \u2014 Lutas e Conquistas \u00e9 um encontro da UNIESBAM. \u201cFalas de Maria\u201d valoriza hist\u00f3rias e protagonismos de mulheres negras e ind\u00edgenas. <a href="negras.html#falas-de-maria">Conhecer Falas de Maria</a>.' };
  }
  return { html: 'Posso ajudar com a <a href="index.html#datas">programa\u00e7\u00e3o</a>, a <a href="negras.html#marielle">hist\u00f3ria de Marielle</a>, as <a href="indigenas.html#vozes">vozes ind\u00edgenas</a>, os museus e o <a href="https://wa.me/5592992673858" target="_blank" rel="noopener noreferrer">WhatsApp da ESBAM</a>.' };
}
function responderChat(pergunta) {
  const resposta = respostaDoChat(pergunta);
  if (typeof resposta === 'string') acrescentarMensagem(resposta, 'bot');
  else acrescentarMensagem('', 'bot', resposta.html);
}

function definirChatAberto(aberto) {
  if (!atalhoChat || !painelChat) return;
  atalhoChat.setAttribute('aria-expanded', String(aberto));
  atalhoChat.setAttribute('aria-label', aberto ? 'Fechar o chatbot' : 'Abrir o chatbot');
  painelChat.hidden = !aberto;
  if (aberto) {
    if (mensagensChat && mensagensChat.childElementCount === 0) {
      acrescentarMensagem('Olá. Sou o guia deste encontro. Pergunte sobre as datas, o evento, Marielle Franco ou a programação gratuita do museu.', 'bot');
    }
    campoChat?.focus();
  } else {
    atalhoChat.focus();
  }
}

if (atalhoChat && painelChat && formularioChat) {
  atalhoChat.addEventListener('click', () => {
    const aberto = atalhoChat.getAttribute('aria-expanded') === 'true';
    definirChatAberto(!aberto);
  });

  botaoFecharChat?.addEventListener('click', () => definirChatAberto(false));

  painelChat.querySelectorAll('.painel-chat__sugestoes button').forEach((botao) => {
    botao.addEventListener('click', () => {
      acrescentarMensagem(botao.textContent.trim(), 'pessoa');
      responderChat(botao.textContent.trim());
    });
  });

  formularioChat.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const pergunta = campoChat?.value.trim();
    if (!pergunta) return;
    acrescentarMensagem(pergunta, 'pessoa');
    responderChat(pergunta);
    if (campoChat) campoChat.value = '';
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && atalhoChat.getAttribute('aria-expanded') === 'true') {
      definirChatAberto(false);
    }
  });

  document.addEventListener('click', (evento) => {
    const aberto = atalhoChat.getAttribute('aria-expanded') === 'true';
    const cliqueNoChat = painelChat.contains(evento.target) || atalhoChat.contains(evento.target);
    if (aberto && !cliqueNoChat) definirChatAberto(false);
  });
}

// Carrossel de Falas de Maria e Marielle Franco: avan?o autom?tico sem controles vis?veis.
const carrossel = document.querySelector('.carrossel');
if (carrossel) {
  const trilho = carrossel.querySelector('.carrossel__trilho');
  const slides = [...carrossel.querySelectorAll('.carrossel__slide')];
  const janela = carrossel.querySelector('.carrossel__janela');
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERVALO_CARROSSEL = 7000;
  let slideAtual = 0;
  let temporizador = null;
  let focoNoCarrossel = false;

  const irParaSlide = (indice, revelar = true) => {
    slideAtual = (indice + slides.length) % slides.length;
    trilho.style.transform = `translateX(-${slideAtual * 100}%)`;
    slides.forEach((slide, i) => {
      const ativo = i === slideAtual;
      slide.inert = !ativo;
      slide.setAttribute('aria-hidden', String(!ativo));
      if (ativo && revelar) slide.querySelectorAll('.revelar').forEach((el) => el.classList.add('revelar--visivel'));
    });
    if (janela) janela.scrollLeft = 0;
    agendarTroca();
  };

  function agendarTroca() {
    clearTimeout(temporizador);
    if (!focoNoCarrossel && !movimentoReduzido.matches && !document.hidden && !document.querySelector('.bio-modal[open]')) {
      temporizador = setTimeout(() => irParaSlide(slideAtual + 1), INTERVALO_CARROSSEL);
    }
  }

  carrossel.addEventListener('focusin', () => { focoNoCarrossel = true; agendarTroca(); });
  carrossel.addEventListener('focusout', (evento) => {
    focoNoCarrossel = carrossel.contains(evento.relatedTarget);
    agendarTroca();
  });
  document.addEventListener('visibilitychange', agendarTroca);
  document.addEventListener('bio-modal-aberto', agendarTroca);
  document.addEventListener('bio-modal-fechado', agendarTroca);
  movimentoReduzido.addEventListener('change', agendarTroca);

  carrossel.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowRight') irParaSlide(slideAtual + 1);
    if (evento.key === 'ArrowLeft') irParaSlide(slideAtual - 1);
  });
  let inicioToque = null;
  trilho.addEventListener('touchstart', (evento) => { inicioToque = evento.touches[0].clientX; }, { passive: true });
  trilho.addEventListener('touchend', (evento) => {
    if (inicioToque === null) return;
    const distancia = evento.changedTouches[0].clientX - inicioToque;
    if (Math.abs(distancia) > 45) irParaSlide(slideAtual + (distancia < 0 ? 1 : -1));
    inicioToque = null;
  });

  const abrirSlideDoEndereco = () => {
    const indice = slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
    if (indice >= 0) {
      irParaSlide(indice);
      document.getElementById('projeto')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  window.addEventListener('hashchange', abrirSlideDoEndereco);
  slides.forEach((slide, i) => {
    document.querySelectorAll(`a[href="#${slide.id}"]`).forEach((link) => {
      link.addEventListener('click', (evento) => {
        evento.preventDefault();
        history.replaceState(null, '', `#${slide.id}`);
        irParaSlide(i);
        document.getElementById('projeto')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  });
  irParaSlide(0, false);
  abrirSlideDoEndereco();
}
// Biografias em modal: as imagens do carrossel abrem o texto completo de cada personagem.
document.querySelectorAll('[data-bio]').forEach((gatilho) => {
  const modal = document.getElementById(gatilho.dataset.bio);
  if (!modal || typeof modal.showModal !== 'function') return;

  gatilho.addEventListener('click', () => {
    modal.showModal();
    document.body.classList.add('modal-aberto');
    document.dispatchEvent(new Event('bio-modal-aberto'));
    modal.querySelector('.bio-modal__corpo')?.scrollTo(0, 0);
    modal.scrollTop = 0;
    modal.querySelector('.bio-modal__fechar')?.focus();
  });

  modal.querySelector('.bio-modal__fechar')?.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) modal.close();
  });
  modal.addEventListener('close', () => {
    document.body.classList.remove('modal-aberto');
    gatilho.focus({ preventScroll: true });
    document.dispatchEvent(new Event('bio-modal-fechado'));
  });
});

// Carrosseis ind?genas: avan?o autom?tico sem barra ou controles vis?veis.
function prepararCarrosselIndigena(seletor, seletorJanela, seletorCartao, intervalo) {
  const trilho = document.querySelector(seletor);
  if (!trilho) return;
  const janela = trilho.closest(seletorJanela);
  if (!janela) return;
  const cartoes = [...trilho.querySelectorAll(seletorCartao)];
  const movimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  let temporizador;
  let emInteracao = false;
  function mover() {
    const largura = cartoes[0]?.getBoundingClientRect().width || janela.clientWidth;
    const passo = largura + (parseFloat(getComputedStyle(trilho).gap) || 0);
    const fim = janela.scrollWidth - janela.clientWidth;
    const destino = janela.scrollLeft >= fim - 2 ? 0 : Math.min(fim, janela.scrollLeft + passo);
    janela.scrollTo({ left: destino, behavior: movimento.matches ? 'auto' : 'smooth' });
  }
  function agendar() {
    clearInterval(temporizador);
    if (emInteracao || movimento.matches || document.hidden) return;
    temporizador = setInterval(mover, intervalo);
  }
  janela.tabIndex = 0;
  janela.addEventListener('keydown', (evento) => {
    if (evento.target !== janela) return;
    if (evento.key === 'ArrowRight' || evento.key === 'ArrowLeft') {
      evento.preventDefault();
      const largura = cartoes[0]?.getBoundingClientRect().width || janela.clientWidth;
      const passo = largura + (parseFloat(getComputedStyle(trilho).gap) || 0);
      janela.scrollBy({ left: evento.key === 'ArrowRight' ? passo : -passo, behavior: 'smooth' });
    }
  });
  janela.addEventListener('focusin', () => { emInteracao = true; agendar(); });
  janela.addEventListener('focusout', (evento) => {
    emInteracao = janela.contains(evento.relatedTarget);
    agendar();
  });
  janela.addEventListener('pointerenter', () => { emInteracao = true; agendar(); });
  janela.addEventListener('pointerleave', () => {
    emInteracao = janela.contains(document.activeElement);
    agendar();
  });
  document.addEventListener('visibilitychange', agendar);
  movimento.addEventListener('change', agendar);
  agendar();
}
prepararCarrosselIndigena('[data-vozes-carrossel]', '.vozes__janela', '.voz-card', 7000);
prepararCarrosselIndigena('[data-historias-carrossel]', '.historias__janela', '.historia-card', 6000);
