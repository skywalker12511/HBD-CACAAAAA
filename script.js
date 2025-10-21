// tambahkan flag global agar btnPlay tidak muncul lagi setelah user sudah menekan
let userInteracted = false;

// Fungsi untuk memulai musik
// Fungsi untuk memulai musik
function playMusic() {
    const audio = document.getElementById('waveform');
    if (!audio) {
        console.warn('Audio element #waveform not found — skipping play.');
        return;
    }
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === 'function') {
        playPromise.catch(err => {
            console.warn('Autoplay prevented or failed:', err);
            // fallback: show a "Play" button so user can start audio manually
            // document.getElementById('btnPlay').classList.remove('d-none');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('waveform');
    const btnPlay = document.getElementById('btnPlay');

    if (!audio) {
        console.warn('Audio element #waveform not found — skipping audio setup.');
        if (btnPlay) btnPlay.classList.add('d-none');
        return;
    }

    function removeGestureListeners() {
        document.removeEventListener('click', onUserGesture);
        document.removeEventListener('touchstart', onUserGesture);
        if (btnPlay) btnPlay.removeEventListener('click', onUserGesture);
    }

    function onUserGesture() {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (btnPlay) btnPlay.classList.add('d-none');
                removeGestureListeners();
            }).catch(err => {
                console.warn('Autoplay prevented or failed:', err);
                // tetap tampilkan tombol agar user bisa menekan manual
                if (btnPlay) btnPlay.classList.remove('d-none');
            });
        } else {
            // older browsers: anggap berhasil
            if (btnPlay) btnPlay.classList.add('d-none');
            removeGestureListeners();
        }
    }

    // jika ada tombol, beri aksi; juga tangani touch/click di dokumen (sekali)
    if (btnPlay) btnPlay.addEventListener('click', onUserGesture);
    document.addEventListener('touchstart', onUserGesture, { once: true });
    document.addEventListener('click', onUserGesture, { once: true });
});

const content = document.getElementById('content');
const footer = document.getElementsByTagName('footer')[0];
const timer = document.getElementById('timer');

const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;
let countDown = new Date('Oct 22, 2023 00:00:00').getTime(),
  x = setInterval(function () {
    let now = new Date().getTime(),
      distance = countDown - now;
    // document.getElementById('days').innerText = Math.floor(distance / (day)),
    document.getElementById('hours').innerText = Math.floor(distance / (hour)),
      document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)),
      document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second);

    if (distance < 0) {

      timer.classList.add('d-none');
      confetti();
      clearInterval(x);
      _slideSatu();
    }

  }, second)

const _slideSatu = function () {
  const tap = document.getElementById('tap');
  const slideSatu = document.getElementById('slideSatu');
  slideSatu.classList.remove('d-none');
  setTimeout(function () {
    tap.classList.remove('d-none');
    // gunakan once supaya listener otomatis dihapus setelah dipanggil sekali
    document.body.addEventListener('click', function () {
      _slideDua();
    }, { once: true });
  }, 5000);
};

const _slideDua = function () {
  const slideSatu = document.getElementById('slideSatu');
  const tap = document.getElementById('tap');
  const slideDua = document.getElementById('slideDua');

  setTimeout(function () {
    slideSatu.classList.replace('animate__slideInDown', 'animate__backOutDown');
    tap.classList.add('d-none');
    setTimeout(function () {
      slideSatu.classList.add('d-none');
    }, 1000);
  }, 1000);

  slideDua.classList.remove('d-none');
  setTimeout(function () {
    tap.classList.remove('d-none');
    // sekali panggil lalu otomatis dihapus
    document.body.addEventListener('click', function () {
      slideDua.classList.replace('animate__zoomInDown', 'animate__fadeOutLeft');
      slideDua.classList.remove('animate__delay-2s', 'animate__slow');
      tap.classList.add('d-none');
      setTimeout(function () {
        slideDua.remove();
        _slideTiga();
      }, 1000);
    }, { once: true });
  }, 10000);
};

const _slideTiga = function () {
  const tap = document.getElementById('tap');
  const slideTiga = document.getElementById('slideTiga');

  slideTiga.classList.remove('d-none');
  setTimeout(function () {
    tap.classList.remove('d-none');
    // sekali panggil lalu otomatis dihapus
    document.body.addEventListener('click', function () {
      slideTiga.classList.remove('animate__delay-2s', 'animate__slow');
      slideTiga.classList.replace('animate__fadeInRight', 'animate__fadeOut');
      tap.remove();
      setTimeout(function () {
        slideTiga.remove();
        _slideEmpat();
      }, 1000);
    }, { once: true });
  }, 8000);
}

function getRandomPosition(element) {
  var x = document.body.offsetHeight - element.clientHeight;
  var y = document.body.offsetWidth - element.clientWidth;
  var randomX = Math.floor(Math.random() * 500);
  var randomY = Math.floor(Math.random() * y);
  return [randomX, randomY];
};

// flag untuk mencegah teks "Terima kasih" tampil lebih dari sekali
window.trimsShown = window.trimsShown || false;

const _slideEmpat = function () {
  const slideEmpat = document.getElementById('slideEmpat');
  const btnGak = document.getElementById('gak');
  const btnSuka = document.getElementById('suka');

  if (!slideEmpat || !btnGak || !btnSuka) return;
  slideEmpat.classList.remove('d-none');

  // hapus listener lama dengan mengganti node supaya tidak doble-bind
  const freshGak = btnGak.cloneNode(true);
  const freshSuka = btnSuka.cloneNode(true);
  btnGak.parentNode.replaceChild(freshGak, btnGak);
  btnSuka.parentNode.replaceChild(freshSuka, btnSuka);

  // set posisi relatif agar transform bekerja pada container
  slideEmpat.style.position = slideEmpat.style.position || 'relative';
  slideEmpat.style.transition = slideEmpat.style.transition || 'transform 0.35s ease, filter 0.35s ease, opacity 0.35s ease';

  // perilaku tombol "Gak!" => saat diklik, kotak "kabur" = berpindah tempat (tidak nge-blur seluruh halaman)
  freshGak.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // hitung perpindahan acak (px)
    const rangeX = 180;
    const rangeY = 80;
    const randX = Math.floor(Math.random() * rangeX) - (rangeX / 2);
    const randY = Math.floor(Math.random() * rangeY) - (rangeY / 2);
    const rot = (Math.random() * 12) - 6; // rotasi kecil supaya terasa "kabur"

    // pastikan animasi halus dan hanya mengubah transform pada elemen box
    slideEmpat.style.transition = 'transform 0.45s cubic-bezier(.2,.8,.2,1)';
    slideEmpat.style.transform = `translate(${randX}px, ${randY}px) rotate(${rot}deg)`;

    // beri umpan balik pada tombol sendiri juga
    freshGak.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => freshGak.classList.remove('animate__shakeX'), 600);

    // kembalikan ke posisi asal setelah delay singkat
    setTimeout(() => {
      slideEmpat.style.transform = 'translate(0, 0) rotate(0deg)';
    }, 700);

    // jangan lanjut ke slide berikutnya — hanya efek gerak
  });

  // tombol "Suka!!" => lanjut ke slide berikutnya (hanya dari sini boleh lanjut)
  freshSuka.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // sembunyikan pertanyaan dan matikan kedua tombol
    slideEmpat.classList.add('d-none');
    freshGak.disabled = true;
    freshSuka.disabled = true;
    freshGak.style.pointerEvents = 'none';
    freshSuka.style.pointerEvents = 'none';

    // tampilkan slide lima (fungsi yang sudah ada) tapi pastikan trims cuma sekali
    _slideLima();
  }, { once: true });
};

const _slideLima = function () {
  const slideLima = document.getElementById('slideLima');
  const trims = document.getElementById('trims');
  if (!slideLima) return;

  slideLima.classList.remove('d-none');
  slideLima.classList.add('animate__animated', 'animate__bounceIn');

  // tampilkan teks terima kasih hanya sekali
  if (trims && !window.trimsShown) {
    window.trimsShown = true;
    trims.classList.remove('d-none');
    trims.innerText = 'MAKASIHHHH CAAAAA!';
  }

  // pastikan event animationend tidak menggandakan efek
  const onEnd = () => {
    slideLima.removeEventListener('animationend', onEnd);
    // jika perlu aksi setelah anim selesai, taruh di sini
  };
  slideLima.addEventListener('animationend', onEnd);
};

const _slideEnam = function () {
  const slideEnam = document.getElementById('slideEnam');
  slideEnam.classList.remove('d-none');
};


new TypeIt("#teks1", {
  strings: ["Hbd Ca Semoga selalu sehat, bahagia, dan sukses keterima kerjaan dimana ae kamu ngelamar terus semoga kamu makin pinter, baik, kaya raya dan makin makin yang bagus bagus pokok"],
  startDelay: 4000,
  speed: 30,
  waitUntilVisible: true
}).go();

new TypeIt("#teks2", {
  strings: ["Wish you all the best lah ca pokok e slide ini ada soale aku gabisa ngilangin e wes panas mataku ca hehe"],
  startDelay: 2000,
  speed: 30,
  waitUntilVisible: true
}).go();



'use strict';

var onlyOnKonami = false;

function confetti() {
  // Globals
  var $window = $(window),
    random = Math.random,
    cos = Math.cos,
    sin = Math.sin,
    PI = Math.PI,
    PI2 = PI * 2,
    timer = undefined,
    frame = undefined,
    confetti = [];

  var runFor = 2000
  var isRunning = true

  setTimeout(() => {
    isRunning = false
  }, runFor);

  // Settings
  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
    pointer = 0;

  var particles = 150,
    spread = 10,
    sizeMin = 5,
    sizeMax = 12 - sizeMin,
    eccentricity = 10,
    deviation = 100,
    dxThetaMin = -.1,
    dxThetaMax = -dxThetaMin - dxThetaMin,
    dyMin = .10,
    dyMax = .15,
    dThetaMin = .4,
    dThetaMax = .7 - dThetaMin;

  var colorThemes = [
    function () {
      return color(200 * random() | 0, 200 * random() | 0, 200 * random() | 0);
    },
    function () {
      var black = 200 * random() | 0;
      return color(200, black, black);
    },
    function () {
      var black = 200 * random() | 0;
      return color(black, 200, black);
    },
    function () {
      var black = 200 * random() | 0;
      return color(black, black, 200);
    },
    function () {
      return color(200, 100, 200 * random() | 0);
    },
    function () {
      return color(200 * random() | 0, 200, 200);
    },
    function () {
      var black = 256 * random() | 0;
      return color(black, black, black);
    },
    function () {
      return colorThemes[random() < .5 ? 1 : 2]();
    },
    function () {
      return colorThemes[random() < .5 ? 3 : 5]();
    },
    function () {
      return colorThemes[random() < .5 ? 2 : 4]();
    }
  ];

  function color(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // Cosine interpolation
  function interpolation(a, b, t) {
    return (1 - cos(PI * t)) / 2 * (b - a) + a;
  }

  // Create a 1D Maximal Poisson Disc over [0, 1]
  var radius = 1 / eccentricity,
    radius2 = radius + radius;

  function createPoisson() {
    // domain is the set of points which are still available to pick from
    // D = union{ [d_i, d_i+1] | i is even }
    var domain = [radius, 1 - radius],
      measure = 1 - radius2,
      spline = [0, 1];
    while (measure) {
      var dart = measure * random(),
        i, l, interval, a, b, c, d;

      // Find where dart lies
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i], b = domain[i + 1], interval = b - a;
        if (dart < measure + interval) {
          spline.push(dart += a - measure);
          break;
        }
        measure += interval;
      }
      c = dart - radius, d = dart + radius;

      for (i = domain.length - 1; i > 0; i -= 2) {
        l = i - 1, a = domain[l], b = domain[i];
        // c---d          c---d  Do nothing
        //   c-----d  c-----d    Move interior
        //   c--------------d    Delete interval
        //         c--d          Split interval
        //       a------b
        if (a >= c && a < d)
          if (b > d) domain[l] = d; // Move interior (Left case)
          else domain.splice(l, 2); // Delete interval
        else if (a < c && b > c)
          if (b <= d) domain[i] = c; // Move interior (Right case)
          else domain.splice(i, 0, c, d); // Split interval
      }

      for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
        measure += domain[i + 1] - domain[i];
    }

    return spline.sort();
  }

  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '0';
  container.style.overflow = 'visible';
  container.style.zIndex = '9999';

  // Confetto constructor
  function Confetto(theme) {
    this.frame = 0;
    this.outer = document.createElement('div');
    this.inner = document.createElement('div');
    this.outer.appendChild(this.inner);

    var outerStyle = this.outer.style,
      innerStyle = this.inner.style;
    outerStyle.position = 'absolute';
    outerStyle.width = (sizeMin + sizeMax * random()) + 'px';
    outerStyle.height = (sizeMin + sizeMax * random()) + 'px';
    innerStyle.width = '100%';
    innerStyle.height = '100%';
    innerStyle.backgroundColor = theme();

    outerStyle.perspective = '50px';
    outerStyle.transform = 'rotate(' + (360 * random()) + 'deg)';
    this.axis = 'rotate3D(' +
      cos(360 * random()) + ',' +
      cos(360 * random()) + ',0,';
    this.theta = 360 * random();
    this.dTheta = dThetaMin + dThetaMax * random();
    innerStyle.transform = this.axis + this.theta + 'deg)';

    this.x = $window.width() * random();
    this.y = -deviation;
    this.dx = sin(dxThetaMin + dxThetaMax * random());
    this.dy = dyMin + dyMax * random();
    outerStyle.left = this.x + 'px';
    outerStyle.top = this.y + 'px';

    // Create the periodic spline
    this.splineX = createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length - 1; i < l; ++i)
      this.splineY[i] = deviation * random();
    this.splineY[0] = this.splineY[l] = deviation * random();

    this.update = function (height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      // Compute spline and convert to polar
      var phi = this.frame % 7777 / 7777,
        i = 0,
        j = 1;
      while (phi >= this.splineX[j]) i = j++;
      var rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
      );
      phi *= PI2;

      outerStyle.left = this.x + rho * cos(phi) + 'px';
      outerStyle.top = this.y + rho * sin(phi) + 'px';
      innerStyle.transform = this.axis + this.theta + 'deg)';
      return this.y > height + deviation;
    };
  }


  function poof() {
    if (!frame) {
      // Append the container
      document.body.appendChild(container);

      // Add confetti

      var theme = colorThemes[onlyOnKonami ? colorThemes.length * random() | 0 : 0],
        count = 0;

      (function addConfetto() {

        if (onlyOnKonami && ++count > particles)
          return timer = undefined;

        if (isRunning) {
          var confetto = new Confetto(theme);
          confetti.push(confetto);

          container.appendChild(confetto.outer);
          timer = setTimeout(addConfetto, spread * random());
        }
      })(0);


      // Start the loop
      var prev = undefined;
      requestAnimationFrame(function loop(timestamp) {
        var delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        var height = $window.height();

        for (var i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            container.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }

        if (timer || confetti.length)
          return frame = requestAnimationFrame(loop);

        // Cleanup
        document.body.removeChild(container);
        frame = undefined;
      });
    }
  }

  $window.keydown(function (event) {
    pointer = konami[pointer] === event.which ?
      pointer + 1 :
      +(event.which === konami[0]);
    if (pointer === konami.length) {
      pointer = 0;
      poof();
    }
  });

  if (!onlyOnKonami) poof();
};

document.addEventListener('DOMContentLoaded', () => {
  const btnGak = document.getElementById('gak');
  if (!btnGak) return;

  // fungsi sederhana untuk memindahkan tombol secara acak (visual)
  function moveGakRandom() {
    const rangeX = 140; // lebar gerak horizontal (px)
    const rangeY = 40;  // lebar gerak vertikal (px)
    const x = Math.floor(Math.random() * rangeX) - (rangeX / 2);
    const y = Math.floor(Math.random() * rangeY) - (rangeY / 2);
    btnGak.style.transition = 'transform 0.18s ease';
    btnGak.style.transform = `translate(${x}px, ${y}px)`;
  }

  // gerakkan saat kursor masuk atau user coba touch
  btnGak.addEventListener('mouseenter', (e) => {
    if (!btnGak.disabled) moveGakRandom();
  });
  btnGak.addEventListener('touchstart', (e) => {
    if (!btnGak.disabled) moveGakRandom();
  }, { passive: true });

  // opsi: terus bergerak tiap 2.5s selama belum diklik (bisa dihapus kalau tidak ingin)
  let moveInterval = setInterval(() => {
    if (btnGak.disabled) { clearInterval(moveInterval); return; }
    moveGakRandom();
  }, 2500);

  // saat benar-benar diklik, hentikan perpindahan dan disable tombol
  btnGak.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    btnGak.disabled = true;
    btnGak.style.pointerEvents = 'none';
    btnGak.style.transform = 'none';
    clearInterval(moveInterval);
    // bila perlu, lakukan aksi lain di sini (mis. feedback)
  }, { once: true });
});


