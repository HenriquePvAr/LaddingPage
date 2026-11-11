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
  const janela = carrossel.querySelector('.carrossel__janela');
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERVALO_CARROSSEL = 7000;
  let slideAtual = 0;
  let temporizador = null;

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
    if (!movimentoReduzido.matches && !document.hidden && !document.querySelector('.bio-modal[open]')) {
      temporizador = setTimeout(() => irParaSlide(slideAtual + 1), INTERVALO_CARROSSEL);
    }
  }

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

// Carrossel automático de trajetórias indígenas, sem botões ou rolagem manual.
const carrosselVozes = document.querySelector('[data-vozes-carrossel]');
if (carrosselVozes) {
  const cartoesOriginais = [...carrosselVozes.querySelectorAll('.voz-card')];
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  let indiceVozAtual = 0;
  let temporizadorVozes;
  const janelaVozes = carrosselVozes.closest('.vozes__janela');
  const quantidadeDeClones = Math.min(3, cartoesOriginais.length);
  cartoesOriginais.slice(0, quantidadeDeClones).forEach((cartao) => {
    const clone = cartao.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((item) => item.setAttribute('tabindex', '-1'));
    carrosselVozes.append(clone);
  });

  function dimensionarCarrosselVozes() {
    if (!janelaVozes) return;
    const quantidadeVisivel = window.innerWidth <= 520 ? 1 : window.innerWidth <= 980 ? 2 : 3;
    const estilo = getComputedStyle(carrosselVozes);
    const gap = parseFloat(estilo.gap) || 0;
    const padding = (parseFloat(estilo.paddingLeft) || 0) + (parseFloat(estilo.paddingRight) || 0);
    const larguraCartao = Math.max(0, (janelaVozes.clientWidth - padding - gap * (quantidadeVisivel - 1)) / quantidadeVisivel);
    carrosselVozes.style.setProperty('--vozes-card-width', `${larguraCartao}px`);
  }

  function moverCarrosselVozes(animar = true) {
    dimensionarCarrosselVozes();
    const cartoes = carrosselVozes.querySelectorAll('.voz-card');
    const cartaoAtual = cartoes[indiceVozAtual];
    if (!cartoes[0] || !cartaoAtual) return;
    const deslocamento = cartaoAtual.offsetLeft - cartoes[0].offsetLeft;
    carrosselVozes.style.transition = animar && !movimentoReduzido.matches ? 'transform 700ms ease-in-out' : 'none';
    carrosselVozes.style.transform = `translate3d(-${deslocamento}px, 0, 0)`;
  }

  function reiniciarAvancoVozes() {
    window.clearInterval(temporizadorVozes);
    if (document.hidden || movimentoReduzido.matches || document.querySelector('.bio-modal[open]')) return;
    temporizadorVozes = window.setInterval(() => {
      indiceVozAtual += 1;
      moverCarrosselVozes();
    }, 7000);
  }

  carrosselVozes.addEventListener('transitionend', (evento) => {
    if (evento.target !== carrosselVozes || indiceVozAtual < cartoesOriginais.length) return;
    carrosselVozes.style.transition = 'none';
    indiceVozAtual = 0;
    moverCarrosselVozes();
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      carrosselVozes.style.transition = movimentoReduzido.matches ? 'none' : 'transform 700ms ease-in-out';
    }));
  });

  document.addEventListener('visibilitychange', reiniciarAvancoVozes);
  document.addEventListener('bio-modal-aberto', reiniciarAvancoVozes);
  document.addEventListener('bio-modal-fechado', reiniciarAvancoVozes);
  movimentoReduzido.addEventListener('change', reiniciarAvancoVozes);
  window.addEventListener('resize', () => moverCarrosselVozes(false), { passive: true });
  moverCarrosselVozes(false);
  reiniciarAvancoVozes();
}

// Carrossel automático dos cartões de povos indígenas, sem setas nem barra de rolagem.
const carrosselHistorias = document.querySelector('[data-historias-carrossel]');
if (carrosselHistorias) {
  const historiasOriginais = [...carrosselHistorias.querySelectorAll('.historia-card')];
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  let indiceHistoriaAtual = 0;
  let temporizadorHistorias;
  const janelaHistorias = document.querySelector('[data-historias-janela]');

  historiasOriginais.slice(0, 4).forEach((cartao) => {
    const clone = cartao.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((item) => item.setAttribute('tabindex', '-1'));
    carrosselHistorias.append(clone);
  });

  function dimensionarCarrosselHistorias() {
    if (!janelaHistorias) return;
    const largura = janelaHistorias.clientWidth;
    const larguraDaJanela = window.innerWidth;
    const quantidadeVisivel = larguraDaJanela <= 520 ? 1 : larguraDaJanela <= 980 ? 2 : 4;
    const gap = parseFloat(getComputedStyle(carrosselHistorias).gap) || 0;
    const larguraCartao = Math.max(0, (largura - gap * (quantidadeVisivel - 1)) / quantidadeVisivel);
    carrosselHistorias.style.setProperty('--historias-card-width', `${larguraCartao}px`);
  }

  function moverCarrosselHistorias(animar = true) {
    dimensionarCarrosselHistorias();
    const cartoes = carrosselHistorias.querySelectorAll('.historia-card');
    const cartaoAtual = cartoes[indiceHistoriaAtual];
    if (!cartoes[0] || !cartaoAtual) return;
    const deslocamento = cartaoAtual.offsetLeft - cartoes[0].offsetLeft;
    carrosselHistorias.classList.toggle('is-animando', animar && !movimentoReduzido.matches);
    carrosselHistorias.style.transform = `translate3d(-${deslocamento}px, 0, 0)`;
  }

  carrosselHistorias.addEventListener('transitionend', (evento) => {
    if (evento.target !== carrosselHistorias || indiceHistoriaAtual < historiasOriginais.length) return;
    carrosselHistorias.classList.remove('is-animando');
    indiceHistoriaAtual = 0;
    moverCarrosselHistorias(false);
  });

  function agendarHistorias() {
    window.clearInterval(temporizadorHistorias);
    if (document.hidden || movimentoReduzido.matches) return;
    temporizadorHistorias = window.setInterval(() => {
      indiceHistoriaAtual += 1;
      moverCarrosselHistorias();
    }, 6000);
  }

  document.addEventListener('visibilitychange', agendarHistorias);
  movimentoReduzido.addEventListener('change', agendarHistorias);
  window.addEventListener('resize', () => moverCarrosselHistorias(false), { passive:true });
  moverCarrosselHistorias(false);
  agendarHistorias();
}
