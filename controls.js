'use strict';
(() => {
  const panel = document.querySelector('#controls');
  if (!panel) return;
  const bindings = {
    move: { label: '이동', keys: ['W', 'A', 'S', 'D'], hint: 'W · A · S · D 키로 이동합니다.' },
    attack: { label: '기본 공격', keys: ['MouseLeft'], hint: '마우스 왼쪽 버튼으로 기본 공격을 합니다.' },
    camera: { label: '카메라 회전', keys: ['MouseRight'], hint: '마우스 오른쪽 버튼을 누른 채 드래그합니다.' },
    zoom: { label: '카메라 확대 축소', keys: ['Wheel'], hint: '마우스 휠을 굴려 시야를 조절합니다.' },
    'camera-lock': { label: '카메라 고정', keys: ['Y'], hint: 'Y 키로 카메라 고정을 전환합니다.' },
    skill: { label: '스킬', keys: ['Q', 'E', 'R', 'C'], hint: 'Q · E · R · C 키로 스킬을 사용합니다.' },
    dash: { label: '대시', keys: ['Shift'], hint: 'Shift 키로 빠르게 대시합니다.' },
    jump: { label: '점프', keys: ['Space'], hint: 'Space 키로 점프합니다.' },
    interact: { label: '상호작용', keys: ['F'], hint: 'F 키로 장치와 상호작용합니다.' },
    inventory: { label: '인벤토리', keys: ['I'], hint: 'I 키로 인벤토리를 엽니다.' },
    items: { label: '아이템 사용', keys: ['1', '2', '3', '4'], hint: '1 · 2 · 3 · 4 키로 아이템을 사용합니다.' },
    gods: { label: '신 페이지', keys: ['G'], hint: 'G 키로 신 페이지를 엽니다.' }
  };
  const buttons = [...panel.querySelectorAll('[data-control]')];
  const shapes = [...panel.querySelectorAll('[data-input]')];
  const label = panel.querySelector('.control-current-label');
  const hint = panel.querySelector('.control-current-hint');
  function selectControl(id) {
    const binding = bindings[id];
    if (!binding) return;
    panel.dataset.control = id;
    const selectedKeys = new Set(binding.keys);
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.control === id)));
    shapes.forEach(shape => shape.classList.toggle('is-lit', selectedKeys.has(shape.dataset.input)));
    label.textContent = binding.label;
    hint.textContent = binding.hint;
  }
  buttons.forEach(button => button.addEventListener('click', () => selectControl(button.dataset.control)));
  selectControl('move');
  new IntersectionObserver(entries => {
    panel.classList.toggle('controls-visible', entries[0].isIntersecting);
  }, { threshold: 0.08 }).observe(panel);
})();
