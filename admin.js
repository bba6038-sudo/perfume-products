const perfumeForm = document.getElementById('perfumeForm');
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
      } else {
        showToast('Failed to add perfume. Please try again.', false);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Server connection error. Please check your network.', false);
    }
  });
}
