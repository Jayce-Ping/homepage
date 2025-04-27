document.addEventListener('DOMContentLoaded', function() {
    // 导航高亮处理
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    function highlightNav() {
      const scrollPosition = window.scrollY;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
    
    // 滚动时高亮导航
    window.addEventListener('scroll', highlightNav);
    
    // 初始化时执行一次高亮
    highlightNav();
    
    // 平滑滚动
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: 'smooth'
        });
      });
    });
    
    // 动画效果 - 滚动显示元素
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // 观察项目卡片和时间线项目
    const animatedElements = document.querySelectorAll('.timeline-item, .project-card');
    animatedElements.forEach(element => {
      observer.observe(element);
    });
    
    // 动态年份更新
    const yearEl = document.querySelector('footer p');
    const currentYear = new Date().getFullYear();
    if (yearEl) {
      yearEl.innerHTML = yearEl.innerHTML.replace('2023', currentYear);
    }
  });