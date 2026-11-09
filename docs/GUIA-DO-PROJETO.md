# Guia do projeto

## Organização e responsabilidades

- `index.html`: fonte única do conteúdo, navegação, datas, experiências e rodapé.
- `css/estilos.css`: componentes, cores, tipografia e comportamento por largura de tela.
- `assets/`: apenas os recursos servidos pela página. O kit recebido completo está preservado em `docs/referencias/kit-landing-afro-indigena/`.
- `js/script.js`: menu móvel acessível, destaque da seção ativa, animações discretas de entrada e geração local de arquivos `.ics` para as datas. Não adicionar dependências para essas interações.
- `docs/evidencias/`: capturas integrais da implementação anterior e da implementação atual.

## Padrão de código

- Escrever conteúdo, nomes de classes e funções, comentários e documentação em português.
- Usar nomes descritivos, HTML semântico, títulos em ordem e IDs estáveis para as âncoras.
- Manter componentes CSS com nomes explicativos no padrão existente, como `.hero__texto` e `.rodape__canais`.
- Manter estilos de foco visíveis, atributos acessíveis e suporte a `prefers-reduced-motion`.
- Manter interações progressivas: sem JavaScript o conteúdo permanece legível; animações respeitam movimento reduzido e os arquivos de calendário usam apenas dados confirmados no HTML.
- Preferir os WebP e SVG oficiais já fornecidos. Não reconstruir a marca nem gravar textos de interface dentro de imagens.
- Preservar links externos com `target="_blank"` junto de `rel="noopener noreferrer"` e rótulos acessíveis.

## Conteúdo confirmado

- Evento: **Cultura Afro e Indígena — Lutas e Conquistas**.
- Datas e unidades: Adrianópolis em 18/11/2026; Centro em 19/11/2026; ViaNorte em 24/11/2026.
- Horário dos três encontros: 18h30–21h30.
- Localizações específicas por cartão: área de convivência e auditório; sala e auditório; auditório.
- As quatro experiências mostradas são as informadas no material do evento.
- O WhatsApp `(92) 99267-3858` corresponde ao contato listado no site institucional. É um canal geral; confirme que encaminha dúvidas deste evento antes da publicação.
- O link UNIESBAM Digital é um portal de cursos e materiais; não é inscrição para o evento.

Não incluir inscrição, palestrantes, valores, certificados ou detalhes de programação sem confirmação institucional. As fontes atuais divergem sobre a carga horária de certificação.

## Validação antes de publicar

1. Servir a pasta pela instrução de execução acima.
2. Revisar a página inteira em 1440, 1024, 768, 390 e 320 px; conferir ordem, alinhamento, recortes e ausência de rolagem horizontal.
3. Conferir se as imagens carregam, as âncoras levam a seções existentes, o menu abre e fecha por toque e teclado, e cada ação de calendário gera a data e a unidade corretas.
4. Confirmar com a instituição o lockup final da logo, pois o arquivo branco recebido tem o subtítulo “Centro Universitário”, diferente do cartaz.
5. Confirmar endereços completos das unidades, canal de atendimento para o evento, carga horária e eventual link oficial de inscrição.

## Evidências visuais

As capturas de referência visual estão em [`docs/evidencias/`](evidencias/). Elas registram a revisão visual anterior às interações de calendário e às animações de entrada. O mockup aprovado e o kit original estão em [`docs/referencias/`](referencias/).
