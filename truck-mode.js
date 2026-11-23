/* ���F�H�\�����G�H�y�������N�ู�A�e�x�P�p�Ц@�γ̪� 10 ���q��C */
(() => {
  table = 1; // �ª��ʪ�������|�ˬd table�F�e���P API ������ܡ��ϥήู�C
  const style = document.createElement('style');
  style.textContent = `
    .truck-orders{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
    .truck-order{min-width:0;background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden}
    .truck-order-head{padding:15px;background:#edf3eb;display:flex;justify-content:space-between;gap:8px;align-items:flex-start}
    .truck-order-head strong{font-size:24px;line-height:1.25;color:var(--green)}
    .truck-order-body{padding:6px 16px}
    .truck-line{padding:12px 0;border-bottom:1px solid var(--line)}
    .truck-order-actions{padding:12px 16px;display:flex;gap:8px;justify-content:flex-end;border-top:1px solid var(--line)}
    .truck-slot{font-size:12px;color:var(--muted)}
    .truck-order .serve-line{padding:12px 0}
    .truck-empty{grid-column:1/-1}
    .truck-confirm{border:2px solid var(--green);border-radius:14px;padding:18px;background:#f4f8f3}
    .truck-confirm-number{font-size:34px;font-weight:800;color:var(--green)}
    @media(max-width:1000px){.truck-orders{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:700px){.truck-orders{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.truck-order-head{padding:12px}.truck-order-body{padding:4px 12px}.truck-order-head strong{font-size:20px}}
    @media(max-width:420px){.truck-orders{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  header = function () {
    return '<header class="app-header"><a class="brand" href="/"><span class="seal">��</span><div><strong>���F�H</strong><small>�\���� QR �I�\</small></div></a><div class="header-right">' +
      (path === '/' ? '<span class="pill">�K��ู?�O�U�y����</span>' : '<span class="subtle">�\����B�޲z</span>' + connection() + '<button class="link-button" data-action="logout">�n�X</button>') +
      '</div></header>';
  };

  billTitle = b => '�y���� ' + String(b.serial ?? b.id ?? '').padStart(4, '0');

  cartContent = function () {
    return '<div class="cart-head"><h2>�ڪ��I�\�M��</h2>' +
      (state.drawer ? '<button class="link-button" data-action="drawer">����</button>' : '') +
      '</div>' +
      (state.cart.length ? state.cart.map((x, i) =>
        '<div class="cart-item"><strong>' + esc(x.name) + '</strong><div class="row"><div class="qty"><button aria-label="���" data-qty="' + i + '" data-delta="-1">?</button><span>' + x.qty + '</span><button aria-label="�W�[" data-qty="' + i + '" data-delta="1">+</button></div><b>' + money(x.price * x.qty) + '</b></div><button class="link-button" data-note="' + i + '">' + (x.note ? '�Ƶ��G' + esc(x.note) : '�s�W�\�I�Ƶ�') + '</button></div>'
      ).join('') : '<div class="cart-empty"><span class="empty-icon">??</span><strong>�٨S�����\</strong>�бq�\�I�M��[�J�\�I</div>') +
      '<div class="cart-total row"><span>�X�p</span><strong class="price">' + money(cartTotal()) + '</strong></div>' +
      '<button class="btn" data-action="submit" ' + (state.cloudReady === false || !state.cart.length || busy || !state.online ? 'disabled' : '') + '>' + (busy ? '�e�椤�K' : '�e�X�q��') + '</button>' +
      '<div class="cart-note">�e���аO�U�e���W���y�����A���d�i�̸����b�C</div>' +
      (state.cart.length ? '' : '');
  };

  renderGuest = function () {
    document.body.classList.add('guest-ordering');
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
    $('#app').innerHTML = header() +
      (state.cloudReady === false ? '<div role="status" style="padding:16px;text-align:center;background:#fff1d6;color:#704812;font-size:18px">�t�ηǳƤ��A�Ȯɤ���e�X�q��C</div>' : '') +
      '<div class="guest-layout"><aside class="categories"><div class="eyebrow">MENU</div><h3>����\�I</h3><div class="category-picker"><label for="category-choice">�\�I����</label><select id="category-choice">' +
      categories.map(c => '<option value="' + esc(c) + '"' + (state.category === c ? ' selected' : '') + '>' + esc(c) + '</option>').join('') +
      '</select></div><div class="category-foot">��n�\�I��e�X�q��A�O�U�y�����A�A���d�i���b�C</div></aside><main>' +
      '<section class="hero"><div class="hero-copy"><div class="eyebrow">SOUP MASTER FOOD TRUCK</div><h1>���F�H�\����<br>QR �I�\</h1><p>��n�\�I?�e�X�q��?�̬y�������b</p><span class="pill" style="display:inline-block;margin-top:13px;background:#ffffffa8;font-size:12px">�e���аO�U�ۤv���y����</span></div><img src="https://tb-static.uber.com/prod/image-proc/processed_images/74363da08811b237f69d99b887897bfd/a19bb09692310dfd41e49a96c424b3a6.jpeg" alt="���F�H�L��"></section>' +
      '<div class="section-heading"><h2 id="menu-heading">' + esc(state.category) + '</h2><input class="search" id="search" placeholder="�j�M�\�I" aria-label="�j�M�\�I" value="' + esc(state.query) + '"></div>' +
      '<div class="menu-grid" id="menu-grid">' + foodCards() + '</div><footer class="developer-credit"><span>���F�H�\���� QR �I�\</span></footer></main>' +
      '<aside id="cart" class="cart ' + (state.drawer ? 'show' : '') + '">' + cartContent() + '</aside></div>' +
      '<button class="mobile-cart" data-action="drawer"><span>�ڪ��I�\�M��?' + count + ' ��</span><strong>' + money(cartTotal()) + '</strong></button>';
  };

  submitOrder = async function () {
    if (busy || !state.cart.length) return;
    busy = true; renderGuest();
    const orderItems = state.cart.map(x => ({ id:x.id, qty:x.qty, note:x.note || '', price:x.price }));
    try {
      const result = await api('/api/order', { requestId:newId(), items:orderItems });
      state.cart = []; persist(); state.drawer = false;
      modal('<div class="truck-confirm"><h2>�q��w�e�X</h2><div>�аO�U�z���y����</div><div class="truck-confirm-number">' + esc(String(result.serial).padStart(4,'0')) + '</div><hr>' +
        orderItems.map(x => { const p=state.menu.find(y=>y.id===x.id); return '<div class="row"><span>' + esc(p?.name || '') + ' �� ' + x.qty + (x.note ? '<div class="note">' + esc(x.note) + '</div>' : '') + '</span><b>' + money((p?.price || x.price) * x.qty) + '</b></div>'; }).join('') +
        '<div class="row" style="margin-top:14px"><strong>�X�p</strong><strong>' + money(orderItems.reduce((sum,x)=>sum+x.price*x.qty,0)) + '</strong></div><p class="checkout-reminder">�Ц��d�i�̬y�������b</p></div><div class="modal-actions"><button class="btn" data-action="close">����</button></div>');
    } catch (error) {
      toast(error.message);
      if (error.status === 409) {
        const latest=await api('/api/menu'); state.menu=latest.menu;
        state.cart=state.cart.map(x=>({...x,price:latest.menu.find(p=>p.id===x.id)?.price ?? x.price})); persist();
      }
    } finally { busy=false; renderGuest(); }
  };

  function latestOrders() {
    return grouped().sort((a,b)=>Number(b.serial||0)-Number(a.serial||0)).slice(0,10);
  }

  function orderCard(order, kitchenView) {
    const allServed=order.lines.every(line=>Number(line.served)===1 || line.served===true);
    const paid=order.status==='paid';
    return '<article class="truck-order"><div class="truck-order-head"><div><strong>' + esc(billTitle(order)) + '</strong><div class="truck-slot">' + time(order.opened_at) + '</div></div><div><span class="status ' + (paid?'done':'') + '">' + (paid?'�w���b':'�ݵ��b') + '</span><br><span class="status ' + (allServed?'done':'') + '">' + (allServed?'�w�X�\':'�s�@��') + '</span></div></div><div class="truck-order-body">' +
      order.lines.map(line => kitchenView ?
        '<div class="serve-line"><input type="checkbox" id="serve-' + esc(line.line_id) + '" data-serve="' + esc(line.line_id) + '" ' + (line.served?'checked':'') + '><label for="serve-' + esc(line.line_id) + '"><strong class="' + (line.served?'done-name':'') + '">' + esc(line.name) + ' �� ' + line.qty + '</strong>' + (line.note?'<div class="note">' + esc(line.note) + '</div>':'') + '</label></div>' :
        '<div class="truck-line"><div class="row"><span>' + esc(line.name) + ' �� ' + line.qty + '</span><b>' + money(line.price*line.qty) + '</b></div>' + (line.note?'<div class="note">' + esc(line.note) + '</div>':'') + '<div class="subtle">' + (line.served?'�w�X�\':'�ݥX�\') + '</div></div>'
      ).join('') +
      '<div class="row" style="padding:12px 0"><strong>�X�p</strong><strong class="price">' + money(order.total) + '</strong></div></div><div class="truck-order-actions">' +
      (!kitchenView ? (paid ? '<span class="status done">���b����</span>' : '<button class="btn small" data-checkout="' + esc(order.id) + '">�y�������b</button>') : '<span class="subtle">�Ŀ��\�I��s�X�\���A</span>') +
      '<button class="btn small danger" data-truck-delete="' + esc(order.id) + '">�����q��</button></div></article>';
  }

  function orderBoard(kitchenView) {
    const orders=latestOrders();
    const title=kitchenView?'�p�ХX�\':'�e�x���b';
    return pageTop(title,'�̷s�q��T�w��ܦb�Ĥ@��A�e���O�d�̪� 10 �i�C','<span class="pill">�ثe ' + orders.length + ' / 10 �i</span>') +
      '<div class="truck-orders">' + (orders.length ? orders.map(o=>orderCard(o,kitchenView)).join('') : '<div class="panel empty truck-empty"><span class="empty-icon">??</span><h3>�ثe�S���q��</h3>�ȤH�e�X�q���|��ܦb�o�̡C</div>') + '</div>';
  }
  cashier = () => orderBoard(false);
  kitchen = () => orderBoard(true);
  qrcodes = function () {
    const cards=[{key:'guest',title:'�\���I�\',href:'/'},{key:'cashier',title:'�e�x���b',href:'/cashier'},{key:'kitchen',title:'�p�ХX�\',href:'/kitchen'}];
    return pageTop('QR Code','�\���U�ȨϥβĤ@�i QR Code �I�\�C','<button class="btn" data-action="print">�C�L QR Code</button>') +
      '<div class="qr-grid">' + cards.map(c=>{const href=siteHref(c.href),image='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(qrSvg(href));return '<article class="qr-card"><h2>'+c.title+'</h2><img class="qrcode" src="'+image+'" alt="'+c.title+' QR Code"><p>'+esc(href)+'</p><div class="actions"><a class="btn small secondary" href="'+image+'" download="'+c.key+'.svg">�U�� SVG</a><a class="btn small ghost" href="'+href+'" target="_blank" rel="noopener">�}��</a></div></article>';}).join('') + '</div>';
  };

  const baseRefresh=refresh;
  refresh = async function () {
    if (polling) return; polling=true;
    try {
      if (path==='/cashier' || path==='/kitchen') {
        const result=await api('/api/board');
        if (JSON.stringify(result.rows)!==JSON.stringify(state.rows)) { state.rows=result.rows; if(!$('#modal').innerHTML) render(); }
      } else if (path==='/') {
        // �X�ȭ����A���ู߮�F�\�I�Ѫ즸���J���o�C
      } else { polling=false; return baseRefresh(); }
      if(!state.online){state.online=true;render();}
    } catch(error) {
      if(error.status===401&&path!=='/'){state.role=null;render();}
      else if(state.online){state.online=false;render();}
    } finally {polling=false;}
  };

  document.addEventListener('click', async event => {
    const button=event.target.closest('[data-truck-delete]');
    if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(!confirm('�����o�i�q�檺�e�x�P�p����ܡH�q��������O�d�ѳ����d�ߡC'))return;
    try { await api('/api/order/archive',{billId:button.dataset.truckDelete}); await refresh(); render(); }
    catch(error){toast(error.message);}
  }, true);

  const originalToast=toast;
  toast=function(message){return originalToast(message);};
})();

