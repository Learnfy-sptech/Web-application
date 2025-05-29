$(document).ready(function() {
    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $('#mobile_btn').find('i').toggleClass('fa-x');
    });

    const sections = $('section');
    const navItems = $('.nav-item');

    $(window).on('scroll', function () {
        const header = $('header');
        const scrollPosition = $(window).scrollTop() - header.outerHeight();

        let activeSectionIndex = 0;

        if (scrollPosition <= 0) {
            header.css('box-shadow', 'none');
        } else {
            header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1');
        }

        sections.each(function(i) {
            const section = $(this);
            const sectionTop = section.offset().top - header.outerHeight();
            const sectionBottom = sectionTop+ section.outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSectionIndex = i;
                return false;
            }
        })

        navItems.removeClass('active');
        $(navItems[activeSectionIndex]).addClass('active');
    });

    ScrollReveal().reveal('#cta', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('#banner', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('.dish', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('#aboutus', {
        origin: 'left',
        duration: 1000,
        distance: '20%'
    })
    
    
    ScrollReveal().reveal('#avaliacoesImagem', {
        origin: 'left',
        duration: 1000,
        distance: '20%'
    })

    ScrollReveal().reveal('.data-slider', {
        origin: 'right',
        duration: 1000,
        distance: '20%'
    })


    ScrollReveal().reveal('.feedback', {
        origin: 'right',
        duration: 1000,
        distance: '20%'
    })

    ScrollReveal().reveal('.faq', {
        origin: 'right',
        duration: 1000,
        distance: '20%'
    })

    ScrollReveal().reveal('#contact', {
        origin: 'right',
        duration: 1000,
        distance: '20%'
    })
});




let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
let autoSlideInterval;

function showSlide(n) {
  if (n > slides.length - 1) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = slides.length - 1;
  }
  slides.forEach(slide => slide.style.display = 'none');
  slides[slideIndex].style.display = 'block';
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex--;
  showSlide(slideIndex);
}

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 3000); 
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

showSlide(slideIndex); 
startAutoSlide(); 

const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseenter', stopAutoSlide);
sliderContainer.addEventListener('mouseleave', startAutoSlide);





const toggles = document.querySelectorAll('.faq-toggle')

toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        toggle.parentNode.classList.toggle('active')
    })
})


// Isso aqui faz o icone de mensagem sumir no Contate-nos 

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.querySelector('#message');
    const icon = document.querySelector('.input-message .icon');

    function toggleIconVisibility() {
        if (textarea.value.trim() !== '') {
            icon.style.opacity = 0; 
        } else {
            icon.style.opacity = 1; 
        }
    }

    textarea.addEventListener('input', toggleIconVisibility);

    toggleIconVisibility();
});

const ctx1 = document.getElementById('ChartOne');

  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Red', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: 'Alunos por região',
        data: [12, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const ctx2 = document.getElementById('ChartTwo');

  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: 'Alunos inadimplentes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  