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

  // 图片预览功能
function showFullImage(src, alt) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('fullImage');
  const captionText = document.getElementById('imageCaption');
  
  modal.style.display = "flex";
  modalImg.src = src;
  captionText.innerHTML = alt;
  
  document.body.style.overflow = 'hidden'; // 禁止背景滚动
}

// 当页面加载完成时
document.addEventListener('DOMContentLoaded', function() {
  // 获取模态框
  const modal = document.getElementById('imageModal');
  
  // 获取关闭按钮
  const closeBtn = document.querySelector('.modal-close');
  
  // 点击关闭按钮关闭模态框
  closeBtn.onclick = function() {
      modal.style.display = "none";
      document.body.style.overflow = ''; // 恢复背景滚动
  }
  
  // 点击模态框背景关闭模态框
  modal.onclick = function(event) {
      if (event.target === modal) {
          modal.style.display = "none";
          document.body.style.overflow = ''; // 恢复背景滚动
      }
  }
  
  // 为所有项目图片添加悬停效果和点击事件
  const projectImages = document.querySelectorAll('.project-image');
  projectImages.forEach(imageContainer => {
      const img = imageContainer.querySelector('img');
      
      // 如果没有通过HTML添加点击事件，在这里添加
      if (!img.hasAttribute('onclick')) {
          img.onclick = function() {
              showFullImage(this.src, this.alt);
          }
      }
  });
  
  document.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
          modal.style.display = "none";
          document.body.style.overflow = '';
      }
  });
});