const perfumeForm = document.getElementById('perfumeForm');
const API_URL = 'https://6a9de8f32f89be7fb70d832c.mockapi.io/perfums';

/**
 * دالة لعرض الإشعارات المنبثقة بدلاً من alert
 * @param {string} message - النص المراد عرضه
 * @param {boolean} isSuccess - تحديد ما إذا كانت العملية ناجحة أم فشلت
 */
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  if (toast && toastMsg) {
    toastMsg.textContent = message;
    
    // تغيير الأيقونة واللون حسب نوع الإشعار
    if (toastIcon) {
      toastIcon.textContent = isSuccess ? '✓' : '✕';
      toastIcon.className = isSuccess ? 'text-emerald-600 text-lg font-bold' : 'text-red-500 text-lg font-bold';
    }

    // إظهار الإشعار عبر إزالة وتعديل الكلاسات
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    // إخفاء الإشعار تلقائياً بعد 3 ثوانٍ
    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
    }, 3000);
  }
}

// الاستماع لحدث تقديم النموذج (Form Submit)
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
            // إظهار الإشعار الناعم بدلاً من alert
            showToast('تم إضافة العطر بنجاح إلى المتجر!', true);
            perfumeForm.reset();
        } else {
            showToast('حدث خطأ أثناء إضافة العطر. حاول مرة أخرى.', false);
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('عذراً، متعذر الاتصال بالخادم حالياً.', false);
    }
});