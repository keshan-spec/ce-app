export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}


export function convertToSubcurrency(amount: number) {
    return Math.round(amount * 100);
}

export const capitalize = (s: string) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const removeBackgroundOverlay = () => {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
};

export const addBackgroundOverlay = () => {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    } else {
        // add overlay
        document.body.insertAdjacentHTML('beforeend', '<div id="overlay" class="fixed inset-0 bg-black bg-opacity-50 z-50"></div>');
    }
};

export const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};