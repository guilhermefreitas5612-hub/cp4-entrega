/* ==========================================================
   PORTFÓLIO — CP4 — scripts.js
   1. Menu hambúrguer (acessível: aria-expanded, Esc, foco)
   2. Gráfico em canvas (página Gráficos)
   3. Formulário: validação com mensagens na tela
      + rascunho salvo em localStorage (página Contato)
   ========================================================== */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. MENU HAMBÚRGUER
       ---------------------------------------------------------- */
    var btnMenu = document.querySelector('.btn-menu');
    var nav = document.getElementById('menu-principal');

    function fecharMenu() {
        if (!btnMenu || !nav) return;
        btnMenu.setAttribute('aria-expanded', 'false');
        btnMenu.setAttribute('aria-label', 'Abrir menu');
        nav.classList.remove('aberto');
    }

    if (btnMenu && nav) {
        btnMenu.addEventListener('click', function () {
            var aberto = btnMenu.getAttribute('aria-expanded') === 'true';
            btnMenu.setAttribute('aria-expanded', String(!aberto));
            btnMenu.setAttribute('aria-label', aberto ? 'Abrir menu' : 'Fechar menu');
            nav.classList.toggle('aberto', !aberto);
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', fecharMenu);
        });

        // Tecla Esc fecha o menu e devolve o foco ao botão
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && btnMenu.getAttribute('aria-expanded') === 'true') {
                fecharMenu();
                btnMenu.focus();
            }
        });
    }

    /* ----------------------------------------------------------
       2. GRÁFICO EM CANVAS (só na página Gráficos)
       ---------------------------------------------------------- */
    var canvas = document.getElementById('meuCanvas');

    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var dados = [
            { nome: 'HTML',       valor: 65, cor: '#05219b' },
            { nome: 'CSS',        valor: 50, cor: '#f30000' },
            { nome: 'JavaScript', valor: 30, cor: '#141414' },
            { nome: 'Python',     valor: 45, cor: '#444444' },
            { nome: 'Power BI',   valor: 40, cor: '#05219b' }
        ];
        var larguraUtil  = canvas.width - 40;
        var larguraBarra = Math.floor(larguraUtil / dados.length) - 8;
        var alturaMaxima = 220;
        var baseY        = 255;
        var posX         = 30;

        dados.forEach(function (item) {
            var altura = (item.valor / 100) * alturaMaxima;
            ctx.fillStyle = item.cor;
            ctx.fillRect(posX, baseY - altura, larguraBarra, altura);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(posX, baseY - altura, larguraBarra, altura);
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.valor + '%', posX + larguraBarra / 2, baseY - altura - 5);
            ctx.font = '11px Arial';
            ctx.fillText(item.nome, posX + larguraBarra / 2, baseY + 15);
            posX += larguraBarra + 8;
        });

        // Eixos e linhas de grade
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 10);
        ctx.lineTo(20, baseY);
        ctx.lineTo(canvas.width - 10, baseY);
        ctx.stroke();

        ctx.fillStyle = '#555';
        ctx.font = '9px Arial';
        ctx.textAlign = 'right';
        for (var i = 0; i <= 100; i += 20) {
            var y = baseY - (i / 100) * alturaMaxima;
            ctx.fillText(i + '%', 18, y + 3);
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(22, y);
            ctx.lineTo(canvas.width - 10, y);
            ctx.stroke();
        }
    }

    /* ----------------------------------------------------------
       3. FORMULÁRIO DE CONTATO
       ---------------------------------------------------------- */
    var form = document.getElementById('form-contato');
    if (!form) return;

    var CHAVE_RASCUNHO = 'gf-portfolio:rascunho-formulario';
    var avisoRascunho = document.getElementById('aviso-rascunho');
    var resumoErros   = document.getElementById('resumo-erros');
    var resumoOk      = document.getElementById('resumo-sucesso');
    var btnLimpar     = document.getElementById('btn-limpar');

    // Campos de texto: id = name
    var CAMPOS_TEXTO = ['nome', 'email', 'telefone', 'data', 'assunto', 'mensagem'];

    /* ---------- localStorage (sempre dentro de try/catch) ---------- */
    function lerRascunho() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE_RASCUNHO)) || null;
        } catch (e) {
            return null;
        }
    }

    function salvarRascunho() {
        try {
            localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(coletar()));
        } catch (e) {
            /* armazenamento indisponível (aba privada, bloqueio): o site segue funcionando */
        }
    }

    function apagarRascunho() {
        try {
            localStorage.removeItem(CHAVE_RASCUNHO);
        } catch (e) { /* ignora */ }
    }

    function coletar() {
        var dados = {};
        CAMPOS_TEXTO.forEach(function (nome) {
            dados[nome] = document.getElementById(nome).value;
        });
        var origem = form.querySelector('input[name="origem"]:checked');
        dados.origem = origem ? origem.value : '';
        dados.interesse = Array.prototype.map.call(
            form.querySelectorAll('input[name="interesse"]:checked'),
            function (el) { return el.value; }
        );
        return dados;
    }

    function aplicar(dados) {
        CAMPOS_TEXTO.forEach(function (nome) {
            if (typeof dados[nome] === 'string') {
                document.getElementById(nome).value = dados[nome];
            }
        });
        form.querySelectorAll('input[name="origem"]').forEach(function (el) {
            el.checked = el.value === dados.origem;
        });
        form.querySelectorAll('input[name="interesse"]').forEach(function (el) {
            el.checked = Array.isArray(dados.interesse) && dados.interesse.indexOf(el.value) !== -1;
        });
    }

    function temConteudo(dados) {
        return CAMPOS_TEXTO.some(function (n) { return dados[n] && dados[n].length; }) ||
            !!dados.origem || (dados.interesse && dados.interesse.length > 0);
    }

    /* ---------- Regras de validação (mensagens em português) ---------- */
    var REGRAS = {
        nome: {
            erroId: 'erro-nome',
            foco: 'nome',
            valida: function (v) {
                return v.trim().length >= 3 ? '' : 'Informe seu nome completo (mínimo de 3 caracteres).';
            }
        },
        email: {
            erroId: 'erro-email',
            foco: 'email',
            valida: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
                    ? '' : 'Informe um e-mail válido, como nome@exemplo.com.';
            }
        },
        telefone: {
            erroId: 'erro-telefone',
            foco: 'telefone',
            valida: function (v) {
                if (!v.trim()) return ''; // campo opcional
                var digitos = v.replace(/\D/g, '');
                return (digitos.length === 10 || digitos.length === 11)
                    ? '' : 'Use DDD + número, com 10 ou 11 dígitos.';
            }
        },
        assunto: {
            erroId: 'erro-assunto',
            foco: 'assunto',
            valida: function (v) {
                return v ? '' : 'Selecione um assunto.';
            }
        },
        origem: {
            erroId: 'erro-origem',
            foco: 'origem-linkedin',
            valida: function () {
                return form.querySelector('input[name="origem"]:checked')
                    ? '' : 'Escolha uma opção em "Como você me conheceu?".';
            }
        },
        mensagem: {
            erroId: 'erro-mensagem',
            foco: 'mensagem',
            valida: function (v) {
                return v.trim().length >= 10 ? '' : 'Escreva uma mensagem com pelo menos 10 caracteres.';
            }
        }
    };

    function valorDe(nome) {
        if (nome === 'origem') {
            var marcado = form.querySelector('input[name="origem"]:checked');
            return marcado ? marcado.value : '';
        }
        return document.getElementById(nome).value;
    }

    // Mostra ou limpa o erro de um campo; devolve a mensagem (vazia = válido)
    function validarCampo(nome) {
        var regra = REGRAS[nome];
        var msg = regra.valida(valorDe(nome));
        var erroEl = document.getElementById(regra.erroId);

        erroEl.textContent = msg;
        erroEl.classList.toggle('d-block', !!msg);

        if (nome === 'origem') {
            form.querySelectorAll('input[name="origem"]').forEach(function (el) {
                el.classList.toggle('is-invalid', !!msg);
            });
        } else {
            var campo = document.getElementById(nome);
            campo.classList.toggle('is-invalid', !!msg);
            campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
        }
        return msg;
    }

    function limparErros() {
        Object.keys(REGRAS).forEach(function (nome) {
            var regra = REGRAS[nome];
            var erroEl = document.getElementById(regra.erroId);
            erroEl.textContent = '';
            erroEl.classList.remove('d-block');
        });
        form.querySelectorAll('.is-invalid').forEach(function (el) {
            el.classList.remove('is-invalid');
            el.removeAttribute('aria-invalid');
        });
        resumoErros.classList.add('d-none');
        resumoErros.textContent = '';
    }

    function mostrarResumoErros(erros) {
        resumoErros.textContent = '';
        var titulo = document.createElement('p');
        titulo.className = 'mb-1 fw-bold';
        titulo.textContent = erros.length === 1
            ? 'Corrija o campo destacado abaixo:'
            : 'Corrija os ' + erros.length + ' campos destacados abaixo:';
        resumoErros.appendChild(titulo);

        var lista = document.createElement('ul');
        lista.className = 'mb-0';
        erros.forEach(function (erro) {
            var li = document.createElement('li');
            var link = document.createElement('a');
            link.href = '#' + REGRAS[erro.nome].foco;
            link.textContent = erro.msg;
            li.appendChild(link);
            lista.appendChild(li);
        });
        resumoErros.appendChild(lista);
        resumoErros.classList.remove('d-none');
    }

    /* ---------- Restaura rascunho ao carregar ---------- */
    var rascunho = lerRascunho();
    if (rascunho && temConteudo(rascunho)) {
        aplicar(rascunho);
        avisoRascunho.textContent = 'Encontramos um rascunho salvo neste navegador e restauramos o que você já havia digitado.';
        avisoRascunho.classList.remove('d-none');
    }

    /* ---------- Salva a cada alteração ---------- */
    form.addEventListener('input', function (e) {
        salvarRascunho();
        if (avisoRascunho && !avisoRascunho.classList.contains('d-none')) {
            avisoRascunho.classList.add('d-none');
        }
        // Se o campo já estava com erro, revalida enquanto o usuário corrige
        var nome = e.target.name === 'origem' ? 'origem' : e.target.id;
        if (REGRAS[nome] && e.target.classList.contains('is-invalid')) {
            validarCampo(nome);
        }
    });

    form.addEventListener('change', function (e) {
        salvarRascunho();
        var nome = e.target.name === 'origem' ? 'origem' : e.target.id;
        if (REGRAS[nome] && e.target.name === 'origem') {
            validarCampo('origem');
        }
    });

    // Valida ao sair de um campo preenchido
    form.addEventListener('blur', function (e) {
        var nome = e.target.id;
        if (REGRAS[nome] && e.target.value) {
            validarCampo(nome);
        }
    }, true);

    /* ---------- Envio ---------- */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        resumoOk.classList.add('d-none');

        var erros = [];
        Object.keys(REGRAS).forEach(function (nome) {
            var msg = validarCampo(nome);
            if (msg) erros.push({ nome: nome, msg: msg });
        });

        if (erros.length) {
            mostrarResumoErros(erros);
            resumoErros.focus();
            document.getElementById(REGRAS[erros[0].nome].foco).focus();
            return;
        }

        // Válido: como o site é estático, nada é enviado a um servidor.
        form.reset();
        limparErros();
        apagarRascunho();
        avisoRascunho.classList.add('d-none');

        resumoOk.textContent = 'Formulário validado com sucesso! Como este site é estático, a mensagem não foi enviada a um servidor. Seu rascunho foi apagado.';
        resumoOk.classList.remove('d-none');
        resumoOk.focus();
    });

    /* ---------- Descartar rascunho ---------- */
    if (btnLimpar) {
        btnLimpar.addEventListener('click', function () {
            form.reset();
            limparErros();
            apagarRascunho();
            avisoRascunho.classList.add('d-none');
            resumoOk.textContent = 'Rascunho descartado.';
            resumoOk.classList.remove('d-none');
            resumoOk.focus();
        });
    }
})();
