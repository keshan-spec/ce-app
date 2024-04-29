export interface InviewPortType {
  callback: () => void;
  target: HTMLElement | null;
  options: IntersectionObserverInit | undefined;
  freezeOnceVisible: boolean;
}

const checkInViewIntersectionObserver = ({
  target,
  options = { root: null, rootMargin: "0%", threshold: 0 },
  callback,
  freezeOnceVisible = false,
}: InviewPortType) => {
  // Check for unsupported IntersectionObserver and invalid target
  if (!window.IntersectionObserver || !target) {
    console.error(
      "Your browser does not support IntersectionObserver or the target element is not provided!"
    );
    return;
  }

  const _funCallback: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        // Check for a valid callback function before calling it
        if (callback && typeof callback === "function") {
          callback();
        }

        // Unobserve if freezeOnceVisible is true
        if (freezeOnceVisible) {
          observer.unobserve(entry.target);
        }
      }
    });
  };

  const observer = new IntersectionObserver(_funCallback, options);
  observer.observe(target);
};

export default checkInViewIntersectionObserver;
