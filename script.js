document.addEventListener('DOMContentLoaded', function() {
  // 标签页切换
  const navLinks = Array.from(document.querySelectorAll('nav a'));
  const sections = Array.from(document.querySelectorAll('.section'));

  if (navLinks.length === 0 || sections.length === 0) {
    throw new Error(
      `tab navigation requires at least one nav link and one .section, ` +
      `got ${navLinks.length} nav links and ${sections.length} sections`
    );
  }

  // 隐藏的面板不会触发 IntersectionObserver，切换时手动加载其中的图片
  function loadImagesIn(section) {
    section.querySelectorAll('.lazy-image[data-src]').forEach(img => {
      img.src = img.getAttribute('data-src');
      img.onload = () => img.classList.add('loaded');
      img.removeAttribute('data-src');
    });
  }

  function activateTab(id) {
    const target = sections.find(section => section.id === id);
    if (!target) {
      throw new Error(
        `no .section found with id ${JSON.stringify(id)}; ` +
        `available ids: ${sections.map(s => s.id).join(', ')}`
      );
    }

    sections.forEach(section => {
      section.classList.toggle('active', section === target);
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-selected', String(isActive));
    });

    loadImagesIn(target);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href').slice(1);
      activateTab(id);
      history.replaceState(null, '', `#${id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const initialId = window.location.hash.slice(1);
  activateTab(sections.some(s => s.id === initialId) ? initialId : sections[0].id);

  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    if (sections.some(s => s.id === id)) {
      activateTab(id);
    }
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
    yearEl.innerHTML = yearEl.innerHTML.replace('2025', currentYear);
  }
  
  // 图片懒加载实现
  const lazyImageOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px 200px 0px' // 提前200px加载图片
  };
  
  const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        
        if (src) {
          img.src = src;
          img.onload = function() {
            img.classList.add('loaded');
          };
          img.removeAttribute('data-src');
          lazyImageObserver.unobserve(img);
        }
      }
    });
  }, lazyImageOptions);
  
  // 对所有带有lazy-image类的图片应用懒加载
  const lazyImages = document.querySelectorAll('.lazy-image');
  lazyImages.forEach(img => {
    lazyImageObserver.observe(img);
  });
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
            // 确保使用加载完成的图片URL
            const imgSrc = this.getAttribute('data-src') || this.src;
            showFullImage(imgSrc, this.alt);
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