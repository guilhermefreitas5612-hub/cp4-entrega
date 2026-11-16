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

})();
