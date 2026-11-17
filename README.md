# Portfólio — Guilherme Freitas

Site pessoal desenvolvido para a disciplina de Desenvolvimento Web (ADS, UBC).

## Páginas

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Apresentação e interesses |
| `curriculo.html` | Formação, habilidades, certificados e experiência (tabelas responsivas) |
| `formulario.html` | Formulário de contato com validação e rascunho salvo no navegador |
| `multimidia.html` | Vídeo de apresentação |
| `graficos.html` | Gráfico em canvas e gráfico em SVG |
| `contato.html` | Links para GitHub e LinkedIn |

## Estrutura

```
index.html ... contato.html   páginas
css/estilos.css               estilos próprios (mobile-first, Flexbox e Grid)
js/scripts.js                 menu, gráfico em canvas e formulário
img/                          imagens e vídeo
```

## Tecnologias

- HTML5 semântico, com `lang="pt-BR"`
- CSS próprio, com Bootstrap 5.3.3 (via CDN) para tabelas, botões, campos e alertas
- JavaScript puro, com `localStorage` para o rascunho do formulário

## Acessibilidade

- Contraste mínimo de 4,5:1 em textos e botões
- Foco visível em todos os elementos interativos
- Link "Pular para o conteúdo" e menu operável pelo teclado (tecla Esc fecha)
- Textos alternativos em imagens e rótulos em todos os campos
- Respeita `prefers-reduced-motion`

## Como visualizar

Abra o `index.html` no navegador, ou sirva a pasta com um servidor local:

```
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.
