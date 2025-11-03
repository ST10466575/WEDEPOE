// Basic product dataset
const PRODUCTS = [
  {id:1,title:"USDC Hoodie",price:85,desc:"Bold-print hoodie with embroidered details.",img:"assets/p1.jpg"},
  {id:2,title:"Embroidered Jacket",price:120,desc:"Heavyweight jacket with stitched artwork.",img:"assets/p2.jpg"},
  {id:3,title:"Graphic Tee",price:35,desc:"Soft cotton tee with front graphic.",img:"assets/p3.jpg"},
  {id:4,title:"Track Pants",price:60,desc:"Relaxed fit track pants with side print.",img:"assets/p4.jpg"},
  {id:5,title:"Bucket Hat",price:28,desc:"Logo bucket hat.",img:"assets/p5.jpg"},
  {id:6,title:"Sneakers",price:140,desc:"Limited drop sneakers.",img:"assets/p6.jpg"}
];

// CART helpers
const CART_KEY = "vs_cart_v1";
function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY))||[] } catch(e){return[]} }
function saveCart(cart){localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartUI()}
function addToCart(item){ const cart = loadCart(); const idx = cart.findIndex(i=>i.id===item.id && i.size===item.size); if(idx>-1){cart[idx].qty += item.qty}else{cart.push(item)} saveCart(cart) }
function removeFromCart(index){ const cart = loadCart(); cart.splice(index,1); saveCart(cart) }
function cartTotal(){ return loadCart().reduce((s,i)=>s + i.qty * i.price,0) }

// UI wiring for multiple pages
document.addEventListener("DOMContentLoaded",()=>{
  // Render products grid on shop page
  const grid = document.getElementById("productsGrid")
  if(grid){
    PRODUCTS.forEach(p=>{
      const el = document.createElement("article")
      el.className = "card"
      el.innerHTML = `<img src="${p.img}" alt=""><h4>${p.title}</h4><p class="price">$${p.price}</p>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
          <a class="btn small" href="product.html?id=${p.id}">View</a>
          <button class="btn small quick-add" data-id="${p.id}">Add</button>
        </div>`
      grid.appendChild(el)
    })
    grid.addEventListener("click", (e)=>{
      if(e.target.matches(".quick-add")){
        const id = +e.target.dataset.id
        const product = PRODUCTS.find(p=>p.id===id)
        addToCart({id:product.id,title:product.title,price:product.price,qty:1,size:"M",img:product.img})
        flashAdded(e.target)
      }
    })
  }

  // Product page - populate from query param
  if(window.location.pathname.endsWith("product.html")){
    const params = new URLSearchParams(location.search)
    const id = +params.get("id") || 1
    const product = PRODUCTS.find(p=>p.id===id) || PRODUCTS[0]
    document.getElementById("productTitle").textContent = product.title
    document.getElementById("productPrice").textContent = "$" + product.price
    document.getElementById("productDesc").textContent = product.desc
    document.getElementById("productImage").src = product.img
    document.getElementById("addToCart").addEventListener("click", ()=>{
      const qty = Math.max(1, parseInt(document.getElementById("qty").value||1))
      const size = document.getElementById("size").value || "M"
      addToCart({id:product.id,title:product.title,price:product.price,qty, size, img:product.img})
      openCartDrawer()
    })
  }

  // Contact form
  const contactForm = document.getElementById("contactForm")
  if(contactForm){
    contactForm.addEventListener("submit", (e)=>{
      e.preventDefault()
      alert("Thanks! Message sent (demo).")
      contactForm.reset()
    })
  }

  // Cart buttons (header)
  document.querySelectorAll(".cart-btn").forEach(btn=>{
    btn.addEventListener("click", (e)=>{ openCartDrawer(e.target) })
  })

  // Close cart buttons
  document.querySelectorAll("#closeCart, #closeCartShop, #closeCartProd").forEach(b=>{
    b?.addEventListener("click", closeCartDrawer)
  })

  // Checkout (demo)
  document.querySelectorAll("#checkoutBtn, #checkoutBtnShop, #checkoutBtnProd").forEach(b=>{
    b?.addEventListener("click", ()=>{
      const total = cartTotal().toFixed(2)
      if(loadCart().length===0){ alert("Your cart is empty."); return }
      alert("Checkout demo — total: $"+total+"\n(Orders are not processed in this demo.)")
      localStorage.removeItem(CART_KEY)
      updateCartUI()
      closeCartDrawer()
    })
  })

  // Update cart UI on load
  updateCartUI()
})

// small helpers for cart drawer
function openCartDrawer(){ 
  document.querySelectorAll(".cart-drawer").forEach(d=>d.classList.add("open"))
  document.querySelectorAll(".overlay").forEach(o=>{ o.classList.add("show"); o.addEventListener("click", closeCartDrawer) })
  updateCartUI()
}
function closeCartDrawer(){
  document.querySelectorAll(".cart-drawer").forEach(d=>d.classList.remove("open"))
  document.querySelectorAll(".overlay").forEach(o=>o.classList.remove("show"))
}

function updateCartUI(){
  const cart = loadCart()
  document.querySelectorAll("#cartCount,#cartCountTop,#cartCountShop,#cartCountProd,#cartCountAbout").forEach(n=>{ if(n) n.textContent = cart.reduce((s,i)=>s+i.qty,0) })
  // Fill every cart drawer's items container
  document.querySelectorAll(".cart-items").forEach(container=>{
    container.innerHTML = ""
    cart.forEach((it, idx)=>{
      const node = document.createElement("div"); node.className="item"
      node.innerHTML = `<img src="${it.img}" alt=""><div style="flex:1"><strong>${it.title}</strong><div>Size: ${it.size} · Qty: ${it.qty}</div></div><div style="text-align:right"><div>$${(it.price*it.qty).toFixed(2)}</div><button class="btn small remove" data-idx="${idx}">Remove</button></div>`
      container.appendChild(node)
    })
    container.addEventListener("click",(e)=>{ if(e.target.matches(".remove")){ removeFromCart(+e.target.dataset.idx) } })
  })
  // totals
  document.querySelectorAll("#cartTotal,#cartTotalShop,#cartTotalProd").forEach(el=>{ if(el) el.textContent = cartTotal().toFixed(2) })
}

// small UI nicety
function flashAdded(el){
  const original = el.textContent
  el.textContent = "Added ✓"
  setTimeout(()=> el.textContent = original, 900)
}
