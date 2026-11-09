# Landing page — Cultura Afro e Indígena 2026

Landing page estática, acessível e responsiva para o evento **Cultura Afro e Indígena — Lutas e Conquistas**, da UNIESBAM.

## Executar localmente

Na pasta raiz do projeto, execute:

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000`. A página não exige instalação de dependências ou etapa de compilação. As fontes Fraunces e Manrope são carregadas do Google Fonts; o navegador usa fontes de reserva se estiver sem conexão.

## Estrutura

```text
index.html                         Conteúdo e seções da página
assets/                            Imagens, ícones, grafismos e tokens usados no site
css/estilos.css                    Identidade visual e regras responsivas
js/script.js                       Menu, navegação ativa, animações e arquivos de calendário
docs/GUIA-DO-PROJETO.md            Manutenção, validação e pendências
docs/evidencias/                   Capturas integrais da página final
```

Consulte o [guia do projeto](docs/GUIA-DO-PROJETO.md) antes de alterar conteúdo, assets ou pontos de quebra.
