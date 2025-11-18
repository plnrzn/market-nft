// JavaScript для валидации форм и дополнительной функциональности
document.addEventListener('DOMContentLoaded', function() {
    
    // Валидация форм
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });

    // Функция для показа Toast уведомлений
    function showToast(message) {
        // Создаем новый toast элемент
        const toastContainer = document.querySelector('.toast-container');
        const toastId = 'toast-' + Date.now();
        
        const toastHtml = `
            <div id="${toastId}" class="toast" role="alert">
                <div class="toast-header">
                    <i class="fa fa-bell text-primary me-2"></i>
                    <strong class="me-auto">Уведомление</strong>
                    <small>только что</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        // Удаляем toast из DOM после скрытия
        toastElement.addEventListener('hidden.bs.toast', function() {
            toastElement.remove();
        });
    }

    // Обработчик для кнопки тестирования Toast
    const toastBtn = document.getElementById('toastBtn');
    if (toastBtn) {
        toastBtn.addEventListener('click', function() {
            showToast('🔔 Это тестовое уведомление!');
        });
    }

    // Функция для обновления прогресс-баров (демонстрация)
    function updateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const currentWidth = parseFloat(bar.style.width) || 0;
            const newWidth = Math.min(currentWidth + 5, 100);
            bar.style.width = newWidth + '%';
            bar.setAttribute('aria-valuenow', newWidth);
            
            // Обновляем текст, если есть
            const parent = bar.closest('.mb-3');
            if (parent) {
                const span = parent.querySelector('span:last-child');
                if (span) {
                    const currentValue = span.textContent.match(/(\d+)/);
                    if (currentValue) {
                        const newValue = parseInt(currentValue[1]) + 1;
                        span.textContent = span.textContent.replace(/\d+/, newValue);
                    }
                }
            }
        });
    }

    // Анимация прогресс-баров при скролле
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.progress-bar');
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('aria-valuenow') || bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                    }, 300);
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Наблюдаем за секцией с прогресс-барами
    const progressSection = document.querySelector('.progress-section');
    if (progressSection) {
        progressObserver.observe(progressSection);
    }

    // Интерактивность для прогресс-баров
    const progressCards = document.querySelectorAll('.progress-section .card');
    progressCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            showToast(`📊 Статистика: ${title}`);
        });
    });

    // Динамическое обновление прогресс-баров (демо)
    function animateProgressBars() {
        const bars = document.querySelectorAll('.progress-bar');
        bars.forEach((bar, index) => {
            const currentWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = currentWidth;
            }, index * 200);
        });
    }

    // Запускаем анимацию прогресс-баров при загрузке
    setTimeout(animateProgressBars, 1000);

    // Обработчик для кнопки "Place Bid" в модальном окне
    const modalBidSubmit = document.querySelector('#modalBidForm button[type="submit"]');
    if (modalBidSubmit) {
        modalBidSubmit.addEventListener('click', function(e) {
            const form = document.getElementById('modalBidForm');
            if (form.checkValidity()) {
                e.preventDefault();
                const bidInput = form.querySelector('input[type="number"]');
                if (bidInput && bidInput.value) {
                    // Показываем Toast уведомление вместо alert
                    showToast(`🎉 Ваша ставка: ${bidInput.value} ETH успешно размещена!`);
                    bidInput.value = '';
                    form.classList.remove('was-validated');
                    
                    // Обновляем прогресс (демонстрация)
                    updateProgressBars();
                    
                    // Закрываем модальное окно
                    const modal = bootstrap.Modal.getInstance(document.getElementById('bidModal'));
                    if (modal) {
                        modal.hide();
                    }
                }
            }
        });
    }

    // Обработчик для кнопки "Submit" в форме ставки
    const submitBtn = document.querySelector('#bidForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            const form = document.getElementById('bidForm');
            if (form.checkValidity()) {
                e.preventDefault();
                const bidInput = form.querySelector('input[type="number"]');
                if (bidInput && bidInput.value) {
                    showToast(`✅ Ваша ставка: ${bidInput.value} ETH отправлена!`);
                    bidInput.value = '';
                    form.classList.remove('was-validated');
                }
            }
        });
    }
    
    // Обработчик для кнопки "CONNECT WALLET" в модальном окне
    const walletButtons = document.querySelectorAll('#walletModal .btn');
    walletButtons.forEach(button => {
        button.addEventListener('click', function() {
            const walletType = this.textContent.trim();
            showToast(`🔗 Подключаем ${walletType}...`);
            
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('walletModal'));
            if (modal) {
                modal.hide();
            }
        });
    });
    
    // Обработчик для кнопки "Start Creating Now"
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            showToast('🚀 Начинаем процесс создания NFT!');
        });
    }

    // Плавная прокрутка для всех ссылок с хэшем
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Кастомная валидация для модальной формы ставки
    const modalBidForm = document.getElementById('modalBidForm');
    if (modalBidForm) {
        const bidInput = modalBidForm.querySelector('input[type="number"]');
        if (bidInput) {
            bidInput.addEventListener('input', function() {
                if (parseFloat(this.value) < 1.76) {
                    this.setCustomValidity('Ставка должна быть выше текущей (1.75 ETH)');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
    }

    // Инициализация карусели с автопрокруткой
    const carousel = document.getElementById('nftCarousel');
    if (carousel) {
        // Автопрокрутка каждые 5 секунд
        setInterval(() => {
            const bsCarousel = bootstrap.Carousel.getInstance(carousel);
            if (bsCarousel) {
                bsCarousel.next();
            }
        }, 5000);
    }

    // Анимация для табов
    const tabButtons = document.querySelectorAll('#nftTabs .nav-link');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Добавляем небольшую задержку для плавности
            setTimeout(() => {
                this.blur();
            }, 150);
        });
    });

    // Обработчики для кнопок в табах
    const tabActionButtons = document.querySelectorAll('.tab-content .btn');
    tabActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const actionText = this.textContent.trim();
            showToast(`📋 Вы выбрали: ${actionText}`);
        });
    });

    // Добавляем классы для анимации при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами для анимации
    document.querySelectorAll('.creator-card, .feature-card, .accordion-item, .progress-section .card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Обработчик для кнопок в слайдере
    const carouselButtons = document.querySelectorAll('.carousel-item .btn');
    carouselButtons.forEach(button => {
        button.addEventListener('click', function() {
            const collectionName = this.closest('.carousel-item').querySelector('h3').textContent;
            showToast(`🖼️ Открываем коллекцию: ${collectionName}`);
        });
    });

    // Обработчик для иконок в карточках creator
    const creatorIcons = document.querySelectorAll('.creator-card .fa');
    creatorIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.classList.contains('fa-caret-up') ? 'лайк' : 'добавление в избранное';
            showToast(`❤️ ${action} засчитан!`);
        });
    });

    console.log('✅ NFT Marketplace initialized successfully!');
    console.log('🎯 Added: Progress Bars and Toast Notifications components');
});