# Projeto Mira — Cultura Afro e Indígena

Site estático e responsivo da UNIESBAM para apresentar histórias, culturas, programação e vozes de mulheres negras e indígenas.

## Executar localmente

Na pasta do projeto, inicie um servidor HTTP:

```powershell
python -m http.server 8000
```

Acesse `http://localhost:8000`. O site não precisa de instalação de dependências ou etapa de compilação. Fraunces e Manrope vêm do Google Fonts; sem conexão, o navegador usa fontes de reserva.

## Páginas

- `index.html`: portal, acesso às páginas culturais, programação e rodapé.
- `negras.html`: conteúdo sobre cultura negra, carrossel de histórias e biografias de mulheres, informações sobre museus e fontes.
- `indigenas.html`: página de mulheres indígenas, histórias de diferentes povos e biografias de lideranças mulheres.

## Arquivos principais

- `css/estilos.css`: estilos compartilhados, componentes e responsividade.
- `css/inicio.css`: composição específica do portal.
- `css/indigenas.css`: composição da página indígena e seus carrosséis.
- `js/script.js`: navegação, carrosséis, modais de biografia, chatbot e arquivos de calendário.
- `assets/`: imagens, ilustrações, ícones, fontes visuais e tokens de cor.
- `docs/GUIA-DO-PROJETO.md`: responsabilidades, orientações editoriais e manutenção.
- `docs/originais/`: cópias históricas de páginas e arquivos de referência; preservar como arquivo.

## Conteúdo e fontes

A agenda e os endereços oficiais ficam em `index.html`; as páginas internas e o chatbot encaminham para `index.html#datas`. Os cartões de histórias dos povos indígenas incluem links para as fontes consultadas. Algumas imagens são ilustrações de personagens fictícias e estão identificadas como representativas; elas não são registros documentais nem retratos de pessoas reais.

O rodapé das páginas inclui o link do [repositório no GitHub](https://github.com/HenriquePvAr/LaddingPage).
