const trendingContainer = document.getElementById('trending-container');
const categoryList = document.getElementById('category-list');
const allProductsGrid = document.getElementById('all-products-grid');
const modalContent = document.getElementById('modal-content');

// --- 1. common rendering function (card design) ---
const createProductCard = (product) => {
    return `
        <div class="group bg-white rounded-3xl p-5 border border-slate-100 hover:shadow-xl transition-all duration-500 flex flex-col h-full">
            <div class="relative h-52 bg-white rounded-2xl p-4 overflow-hidden mb-4">
                <img src="${product.image}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500">
                <span class="absolute top-2 right-2 badge badge-ghost text-[10px] font-bold uppercase">${product.category}</span>
            </div>
            <div class="flex-grow text-left">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-yellow-600 font-bold text-sm"><i class="fa-solid fa-star"></i> ${product.rating.rate}</span>
                    <span class="text-lg font-black text-slate-900">$${product.price}</span>
                </div>
                <h4 class="font-bold text-slate-800 line-clamp-1 mb-4" title="${product.title}">${product.title}</h4>
            </div>
            <div class="flex gap-2 mt-auto">
                <button onclick="loadSingleProduct(${product.id})" class="btn btn-sm btn-outline flex-1 rounded-xl">Details</button>
                <button class="btn btn-sm btn-warning flex-1 rounded-xl"><i class="fa-solid fa-cart-plus"></i></button>
            </div>
        </div>`;
};

// --- 2. trending products (first 3) ---
const loadTrending = async () => {
    try {
        const res = await fetch('https://fakestoreapi.com/products?limit=3');
        const products = await res.json();
        trendingContainer.innerHTML = products.map(p => createProductCard(p)).join('');
    } catch (err) { console.error("Trending load failed", err); }
};

// --- 3. category button generation ---
const loadCategories = async () => {
    try {
        const res = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await res.json();
        categoryList.innerHTML = `<button onclick="filterProducts('all')" class="btn btn-warning rounded-full px-8 font-bold">All</button>`;
        categories.forEach(cat => {
            categoryList.innerHTML += `<button onclick="filterProducts('${cat}')" class="btn btn-outline border-slate-300 rounded-full px-8 capitalize hover:btn-warning">${cat}</button>`;
        });
    } catch (err) { console.error("Category load failed", err); }
};

// --- 4. category wise product filter ---
const filterProducts = async (category) => {
    allProductsGrid.innerHTML = `<div class="col-span-full text-center py-10"><span class="loading loading-spinner loading-lg text-yellow-500"></span></div>`;
    let url = category === 'all' ? 'https://fakestoreapi.com/products' : `https://fakestoreapi.com/products/category/${category}`;
    try {
        const res = await fetch(url);
        const products = await res.json();
        allProductsGrid.innerHTML = products.map(p => createProductCard(p)).join('');
    } catch (err) { console.error("Filter failed", err); }
};

// --- 5. modal data load ---
const loadSingleProduct = async (id) => {
    document.getElementById('details-modal').checked = true;
    modalContent.innerHTML = `<div class="p-20 text-center"><span class="loading loading-spinner loading-lg text-yellow-500"></span></div>`;
    try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        modalContent.innerHTML = `
            <div class="flex flex-col md:flex-row gap-8 p-6 md:p-10 text-left">
                <div class="flex-1 bg-white p-6 rounded-2xl flex items-center justify-center">
                    <img src="${data.image}" class="max-h-64 object-contain">
                </div>
                <div class="flex-1 space-y-4">
                    <span class="badge badge-warning font-bold uppercase">${data.category}</span>
                    <h2 class="text-2xl font-black text-slate-900 leading-tight">${data.title}</h2>
                    <p class="text-slate-600 text-sm leading-relaxed">${data.description}</p>
                    <div class="flex items-center gap-4 py-2">
                        <span class="text-3xl font-black text-slate-900">$${data.price}</span>
                        <span class="badge badge-outline p-3 font-bold">★ ${data.rating.rate}</span>
                    </div>
                    <div class="pt-4 flex gap-4">
                        <button class="btn btn-warning flex-1 rounded-2xl font-bold">Add to Cart</button>
                        <label for="details-modal" class="btn btn-ghost border-slate-200 flex-1 rounded-2xl">Close</label>
                    </div>
                </div>
            </div>`;
    } catch (err) { console.error("Modal load failed", err); }
};

// Initial Execution
loadTrending();
loadCategories();
filterProducts('all');