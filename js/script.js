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
    '.hero__texto, .hero__arte, .manifesto__interno, .projeto__imagem, .projeto__texto, .cartao-data, .cartao-experiencia, .chamado-museu__cartao, .convite__arte, .convite__texto, .rodape__grade > *',
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
  if (/data|quando|hor[aá]rio|onde|local|adrian|vianorte|centro/.test(texto)) {
    return 'Os encontros são em Manaus, das 18h30 às 21h30: 18 de novembro em Adrianópolis, 19 no Centro e 24 na ViaNorte. Os endereços completos ainda serão confirmados pela instituição.';
  }
  if (/marielle/.test(texto)) {
    return 'Marielle Franco (1979–2018) foi socióloga, feminista e vereadora do Rio de Janeiro. Negra e criada na Maré, é referência das lutas de mulheres negras, da população LGBTQIA+ e das favelas. Há um texto sobre ela nesta página.';
  }
  if (/muncab|afro-?brasileir|salvador|bahia/.test(texto)) {
    return 'O Museu Nacional da Cultura Afro-Brasileira (MUNCAB) fica no Centro Histórico de Salvador (BA). A entrada é gratuita às quartas-feiras e aos domingos, com reserva online. Mais informações em muncab.com.br.';
  }
  if (/museu|ind[ií]gena|gratui|programa/.test(texto)) {
    return 'O Museu das Culturas Indígenas, em São Paulo, tem entrada gratuita para o público em geral às quintas-feiras. Pessoas indígenas entram sem custo todos os dias. A programação está em museudasculturasindigenas.org.br.';
  }
  if (/whats|contato|telefone|falar/.test(texto)) {
    return { html: 'O WhatsApp da ESBAM é o (92) 99267-3858. <a href="https://wa.me/5592992673858" target="_blank" rel="noopener noreferrer">Abrir conversa</a>.' };
  }
  if (/evento|projeto|maria|o que|sobre/.test(texto)) {
    return 'Cultura Afro e Indígena — Lutas e Conquistas é um encontro da UNIESBAM em novembro de 2026. “Falas de Maria” valoriza histórias e protagonismos de mulheres negras e indígenas, com abertura cultural, círculo de conversas, sabores da ancestralidade e encerramento cultural.';
  }
  return 'Posso contar as datas do encontro, explicar o evento, falar de Marielle Franco, da programação gratuita do Museu das Culturas Indígenas ou abrir o WhatsApp da ESBAM.';
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

// Carrossel de "Falas de Maria" e Marielle Franco: troca automática, setas, pontos, teclado e gesto de arrastar.
const carrossel = document.querySelector('.carrossel');
if (carrossel) {
  const trilho = carrossel.querySelector('.carrossel__trilho');
  const slides = [...carrossel.querySelectorAll('.carrossel__slide')];
  const pontos = [...carrossel.querySelectorAll('.carrossel__pontos button')];
  let slideAtual = 0;

  const janela = carrossel.querySelector('.carrossel__janela');
  const irParaSlide = (indice, revelar = true) => {
    slideAtual = (indice + slides.length) % slides.length;
    trilho.style.transform = `translateX(-${slideAtual * 100}%)`;
    slides.forEach((slide, i) => {
      const ativo = i === slideAtual;
      slide.inert = !ativo;
      slide.setAttribute('aria-hidden', String(!ativo));
      if (ativo && revelar) slide.querySelectorAll('.revelar').forEach((el) => el.classList.add('revelar--visivel'));
    });
    pontos.forEach((ponto, i) => ponto.setAttribute('aria-current', String(i === slideAtual)));
    if (janela) janela.scrollLeft = 0;
    agendarTroca();
  };

  // Troca automática a cada 7 segundos. Para quando a pessoa pausa, passa o mouse,
  // navega pelo teclado dentro do carrossel, abre uma biografia ou sai da aba.
  const INTERVALO_CARROSSEL = 7000;
  const botaoPausa = carrossel.querySelector('.carrossel__pausa');
  let temporizador = null;
  let pausadoPelaPessoa = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mouseSobre = false;
  let focoDentro = false;

  function trocaPermitida() {
    return !pausadoPelaPessoa && !mouseSobre && !focoDentro && !document.hidden
      && !document.querySelector('.bio-modal[open]');
  }

  function agendarTroca() {
    clearTimeout(temporizador);
    if (trocaPermitida()) temporizador = setTimeout(() => irParaSlide(slideAtual + 1), INTERVALO_CARROSSEL);
  }

  function atualizarBotaoPausa() {
    if (!botaoPausa) return;
    botaoPausa.setAttribute('aria-pressed', String(pausadoPelaPessoa));
    botaoPausa.textContent = pausadoPelaPessoa ? 'Reproduzir' : 'Pausar';
    botaoPausa.setAttribute('aria-label', pausadoPelaPessoa ? 'Retomar a troca automática dos slides' : 'Pausar a troca automática dos slides');
  }

  botaoPausa?.addEventListener('click', () => {
    pausadoPelaPessoa = !pausadoPelaPessoa;
    atualizarBotaoPausa();
    agendarTroca();
  });
  carrossel.addEventListener('mouseenter', () => { mouseSobre = true; agendarTroca(); });
  carrossel.addEventListener('mouseleave', () => { mouseSobre = false; agendarTroca(); });
  carrossel.addEventListener('focusin', (evento) => {
    focoDentro = evento.target.matches(':focus-visible');
    agendarTroca();
  });
  carrossel.addEventListener('focusout', (evento) => {
    if (!carrossel.contains(evento.relatedTarget)) { focoDentro = false; agendarTroca(); }
  });
  document.addEventListener('visibilitychange', agendarTroca);
  document.addEventListener('bio-modal-fechado', agendarTroca);
  atualizarBotaoPausa();

  carrossel.querySelectorAll('.carrossel__seta').forEach((seta) => {
    seta.addEventListener('click', () => irParaSlide(slideAtual + Number(seta.dataset.direcao)));
  });
  pontos.forEach((ponto, i) => ponto.addEventListener('click', () => irParaSlide(i)));

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

  // Links para #marielle ou #falas-de-maria abrem o slide certo.
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
