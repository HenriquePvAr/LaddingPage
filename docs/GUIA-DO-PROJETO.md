# Guia do projeto

## Organização

- `index.html`: portal, navegação, programação oficial, endereços e rodapé.
- `negras.html`: histórias e biografias de mulheres negras, museus e fontes.
- `indigenas.html`: histórias de povos indígenas e biografias de lideranças mulheres.
- `css/estilos.css`: estilos compartilhados, cores, tipografia, componentes e pontos de quebra.
- `css/inicio.css`: estilos do portal.
- `css/indigenas.css`: estilos específicos da página indígena, incluindo seus cartões e carrosséis.
- `js/script.js`: menu, navegação, animações, carrosséis, modais, chatbot e arquivos `.ics` de calendário.
- `assets/`: imagens, ilustrações, ícones e tokens visuais.
- `docs/evidencias/`: capturas de referência.
- `docs/originais/`: arquivos preservados; não fazem parte da navegação atual e devem ser tratados como arquivo histórico.

## Conteúdo e edição

- Manter datas e endereços oficiais exclusivamente em `index.html`. As páginas internas e o chatbot devem encaminhar para `index.html#datas`.
- Biografias nas páginas culturais devem apresentar mulheres. Histórias de povos podem explicar saberes coletivos, mas imagens de pessoas nessas seções devem seguir o pedido editorial de representar mulheres.
- Preservar as fontes nos cartões e textos. Não atribuir a personagens fictícias citações, fotografias ou créditos de pessoas reais.
- As novas imagens ilustrativas de personagens fictícias devem manter texto alternativo e legenda que deixem claro seu caráter representativo; não são retratos documentais.
- Usar `target="_blank"` sempre com `rel="noopener noreferrer"` em links externos.
- Não gravar textos de interface dentro de imagens. Preservar os arquivos de marca recebidos.

## Padrões de interface

- Escrever conteúdo, classes, funções e comentários em português.
- Usar HTML semântico, títulos hierárquicos, IDs estáveis, foco visível e rótulos acessíveis.
- Manter o suporte a `prefers-reduced-motion` nas animações e carrosséis.
- O carrossel de histórias e cartões de povos indígenas tem controles de avançar/voltar e avanço automático. O carrossel de vozes indígenas é horizontal e avança automaticamente.
- O carrossel de histórias de `negras.html` tem setas para avançar e voltar, além do avanço automático.
- Ao alterar larguras de cartões, conferir também os estilos responsivos correspondentes em `css/indigenas.css` e `css/estilos.css`.

## Revisão antes de publicar

1. Servir a pasta com o comando em “Executar localmente” no README.
2. Conferir as páginas completas em desktop e celular: ordem, alinhamento, recortes das imagens e ausência de rolagem horizontal.
3. Conferir imagens locais, links de fonte, âncoras, menus, carrosséis, modais de biografia e ações de calendário.
4. Confirmar que cada crédito corresponde à imagem exibida e que ilustrações fictícias estão identificadas.
5. Conferir se o rodapé e os links do repositório estão visíveis em todas as páginas.

## Referências históricas

A entrada atual é `index.html`. A agenda fica nessa página, com acesso por `index.html#datas`. As cópias em `docs/originais/` guardam versões anteriores e não devem ser alteradas ao atualizar o conteúdo ativo.
