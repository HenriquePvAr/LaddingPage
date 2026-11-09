# Guia do projeto

## Organização e responsabilidades

- `index.html`: fonte única do conteúdo, navegação, datas, experiências e rodapé.
- `css/estilos.css`: componentes, cores, tipografia e comportamento por largura de tela.
- `assets/`: imagens, ícones, grafismos e tokens servidos pela página.
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



## Validação antes de publicar

1. Servir a pasta pela instrução de execução acima.
2. Revisar a página inteira em 1440, 1024, 768, 390 e 320 px; conferir ordem, alinhamento, recortes e ausência de rolagem horizontal.
3. Conferir se as imagens carregam, as âncoras levam a seções existentes, o menu abre e fecha por toque e teclado, e cada ação de calendário gera a data e a unidade corretas.
4. Confirmar com a instituição o lockup final da logo, pois o arquivo branco recebido tem o subtítulo “Centro Universitário”, diferente do cartaz.


## Evidências visuais

As capturas integrais da página estão em [`docs/evidencias/`](evidencias/): `landing-page-desktop-1440px.png` e `landing-page-celular-390px.png`.
