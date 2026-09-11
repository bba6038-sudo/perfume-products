const perfumeForm = document.getElementById('perfumeForm');
const adminProductsContainer = document.getElementById('adminProductsContainer');
const API_URL = 'https://6a9de8f32f89be7fb70d832c.mockapi.io/perfums';

function showToast(message, isSuccess = true) {
  const toast = document.createElement('div');

  toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-stone-900/95 text-stone-100 px-6 py-4 rounded-2xl shadow-2xl border border-stone-800 backdrop-blur-md transition-all duration-500 ease-in-out opacity-0 pointer-events-none translate-y-6 max-w-sm w-auto whitespace-nowrap`;

  const iconSymbol = isSuccess ? '✓' : '✕';
  const iconClass = isSuccess ? 'text-emerald-400' : 'text-rose-400';

  toast.innerHTML = `
    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-stone-800 shrink-0">
      <span class="${iconClass} text-sm font-bold">${iconSymbol}</span>
    </div>
    <div class="flex flex-col gap-0.5 text-left">
      <span class="text-[10px] font-semibold tracking-widest text-amber-400/90 uppercase">Store Manager</span>
      <p class="text-xs font-medium tracking-wide text-stone-200">${message}</p>
    </div>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-6');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-6');

    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3500);
}

async function loadPerfumes() {
  if (!adminProductsContainer) return;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch data');
    
    const perfumes = await response.json();

    if (perfumes.length === 0) {
      adminProductsContainer.innerHTML = `<p class="text-gray-500 text-sm text-center col-span-full">No perfumes found in catalog.</p>`;
      return;
    }

    adminProductsContainer.innerHTML = perfumes.map(perfume => `
      <div class="relative bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
        <div class="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
            <img src="${perfume.image}" alt="${perfume.name}" class="h-full w-full object-cover">
        </div>

        <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-gray-800 truncate">${perfume.name}</h4>
            <p class="text-xs text-gray-500">${perfume.category}</p>
            <span class="text-xs text-blue-600 font-bold">$${perfume.price}</span>
        </div>

        <button onclick="deleteProduct('${perfume.id}')" 
            aria-label="Delete product" 
            class="p-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 rounded-lg transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
        </button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading perfumes:', error);
    showToast('Failed to load perfumes.', false);
  }
}

async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this perfume?')) return;

  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      showToast('Perfume deleted successfully!', true);
      loadPerfumes();
    } else {
      showToast('Failed to delete perfume.', false);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    showToast('Server error while deleting.', false);
  }
}

if (perfumeForm) {
  perfumeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const pName = document.getElementById('pName').value;
    const pPrice = document.getElementById('pPrice').value;
    const pCategory = document.getElementById('pCategory').value;
    const pImage = document.getElementById('pImage').value;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: pName,
          price: pPrice,
          category: pCategory,
          image: pImage,
        }),
      });

      if (response.ok) {
        showToast('Perfume successfully added to catalog!', true);
        perfumeForm.reset();
        loadPerfumes();
      } else {
        showToast('Failed to add perfume. Please try again.', false);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Server connection error. Please check your network.', false);
    }
  });
}

document.addEventListener('DOMContentLoaded', loadPerfumes);
