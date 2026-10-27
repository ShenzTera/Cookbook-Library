/* Hand-drawn style SVG art: ingredients (parametric templates), plates and cooking vessels. */
var ART = (function () {
  function rng(s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  var uid = 0;
  var wrap = function (b) { return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + b + '</svg>'; };
  var BOWL = '<path d="M12 52 Q12 92 50 92 Q88 92 88 52Z" fill="#efe7da" stroke="#8d806d" stroke-width="3" stroke-linejoin="round"/>';

  var T = {
    round: function (c, d, o) {
      var rx = o.rx || 33, ry = o.ry || 31, s = '';
      s += '<ellipse cx="50" cy="57" rx="' + rx + '" ry="' + ry + '" fill="' + c + '" stroke="' + d + '" stroke-width="3"/>';
      s += '<ellipse cx="38" cy="45" rx="9" ry="6" fill="#fff" opacity=".35" transform="rotate(-30 38 45)"/>';
      if (o.pit) s += '<circle cx="50" cy="62" r="11" fill="#8a5a2b" stroke="#5b3a1a" stroke-width="2"/>';
      if (o.nubs) s += '<circle cx="' + (50 - rx - 2) + '" cy="57" r="4" fill="' + c + '" stroke="' + d + '" stroke-width="2"/><circle cx="' + (50 + rx + 2) + '" cy="57" r="4" fill="' + c + '" stroke="' + d + '" stroke-width="2"/>';
      if (o.spots) for (var i = 0; i < 7; i++) s += '<circle cx="' + (30 + (i * 37) % 40) + '" cy="' + (48 + (i * 53) % 22) + '" r="2" fill="' + d + '" opacity=".6"/>';
      if (o.stem) s += '<path d="M50 28 Q48 18 54 12" stroke="#3f8f3a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M50 27 Q38 20 30 28 Q42 33 50 27Z M50 27 Q62 20 70 28 Q58 33 50 27Z" fill="#4caf50" stroke="#2e7d32" stroke-width="2"/>';
      return s;
    },
    long: function (c, d, o) {
      var s = '<g transform="rotate(-30 50 50)">';
      if (o.fat) s += '<rect x="14" y="34" width="76" height="32" rx="16" fill="' + c + '" stroke="' + d + '" stroke-width="3"/><rect x="24" y="40" width="40" height="6" rx="3" fill="#fff" opacity=".3"/>';
      else s += '<path d="M14 38 Q8 50 14 62 L90 52 Q96 50 90 48Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/><path d="M30 46 l8 0 M46 52 l8 -1 M62 49 l8 0" stroke="' + d + '" stroke-width="2" stroke-linecap="round"/>';
      if (o.top) s += '<path d="M14 50 Q4 36 2 28 Q14 32 16 44Z M14 50 Q2 50 -2 50 Q6 44 14 46Z M14 50 Q4 64 2 72 Q14 66 16 56Z" fill="' + o.top + '" stroke="#2e7d32" stroke-width="2" stroke-linejoin="round"/>';
      return s + '</g>';
    },
    pile: function (c, d) {
      var r = rng(5), s = '<ellipse cx="50" cy="80" rx="40" ry="12" fill="#cfc4b4" stroke="#8d806d" stroke-width="2.5"/>';
      s += '<path d="M14 78 Q30 30 50 26 Q70 30 86 78 Q50 92 14 78Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>';
      for (var i = 0; i < 14; i++) s += '<circle cx="' + (26 + r() * 48).toFixed(1) + '" cy="' + (46 + r() * 30).toFixed(1) + '" r="1.8" fill="' + d + '" opacity=".55"/>';
      return s + '<path d="M36 44 Q42 34 50 32" stroke="#fff" stroke-width="3" opacity=".4" fill="none" stroke-linecap="round"/>';
    },
    bottle: function (c, d, o) {
      return '<rect x="38" y="8" width="24" height="14" rx="3" fill="' + (o.cap || '#8d6e63') + '"/><path d="M40 22 L40 34 Q24 44 24 60 L24 88 Q24 94 30 94 L70 94 Q76 94 76 88 L76 60 Q76 44 60 34 L60 22Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/><rect x="30" y="56" width="40" height="24" rx="3" fill="#fff" opacity=".85"/><path d="M36 64 h28 M36 72 h18" stroke="' + d + '" stroke-width="2.5" stroke-linecap="round"/><path d="M32 42 Q30 52 30 60" stroke="#fff" stroke-width="3" opacity=".5" fill="none" stroke-linecap="round"/>';
    },
    block: function (c, d, o) {
      var s = '<polygon points="50,16 90,34 50,52 10,34" fill="' + (o.l || c) + '" stroke="' + d + '" stroke-width="2.5" stroke-linejoin="round"/><polygon points="10,34 50,52 50,90 10,72" fill="' + c + '" stroke="' + d + '" stroke-width="2.5" stroke-linejoin="round"/><polygon points="50,52 90,34 90,72 50,90" fill="' + d + '" stroke="' + d + '" stroke-width="2.5" stroke-linejoin="round" opacity=".85"/>';
      if (o.holes) s += '<circle cx="30" cy="62" r="4" fill="' + d + '" opacity=".6"/><circle cx="38" cy="76" r="3" fill="' + d + '" opacity=".6"/><circle cx="70" cy="62" r="3" fill="#000" opacity=".2"/><circle cx="50" cy="34" r="3.5" fill="' + d + '" opacity=".5"/>';
      return s;
    },
    drum: function (c, d) {
      return '<g transform="rotate(-25 50 50)"><rect x="60" y="44" width="30" height="12" rx="6" fill="#f3ead9" stroke="#8d7d63" stroke-width="2.5"/><circle cx="91" cy="44" r="7" fill="#f3ead9" stroke="#8d7d63" stroke-width="2.5"/><circle cx="91" cy="56" r="7" fill="#f3ead9" stroke="#8d7d63" stroke-width="2.5"/><ellipse cx="40" cy="50" rx="32" ry="26" fill="' + c + '" stroke="' + d + '" stroke-width="3"/><ellipse cx="30" cy="40" rx="12" ry="6" fill="#fff" opacity=".35"/><path d="M26 56 Q40 64 54 54" stroke="' + d + '" stroke-width="2" fill="none" opacity=".5"/></g>';
    },
    steak: function (c, d) {
      return '<path d="M16 50 Q14 24 44 20 Q82 14 88 42 Q92 74 58 82 Q20 90 16 50Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/><path d="M28 40 Q44 34 58 44 M30 58 Q48 52 70 62 M44 30 Q60 28 74 36" stroke="#fff" stroke-width="3" opacity=".55" fill="none" stroke-linecap="round"/>';
    },
    bacon: function (c, d) {
      var s = '';
      [[10, 24], [10, 46], [10, 68]].forEach(function (p, i) {
        s += '<path d="M' + p[0] + ' ' + p[1] + ' q10 -8 20 0 t20 0 t20 0 t20 0 v14 q-10 8 -20 0 t-20 0 t-20 0 t-20 0Z" fill="' + c + '" stroke="' + d + '" stroke-width="2.5"/><path d="M' + (p[0] + 6) + ' ' + (p[1] + 7) + ' q10 -6 20 0 t20 0 t20 0" stroke="#fff" stroke-width="3" opacity=".55" fill="none"/>';
      });
      return s;
    },
    bowl: function (c, d) {
      var r = rng(7), s = '<path d="M14 54 Q18 26 50 24 Q82 26 86 54Z" fill="' + c + '" stroke="' + d + '" stroke-width="2.5"/>';
      for (var i = 0; i < 22; i++) { var x = 20 + r() * 60, y = 30 + r() * 22; s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="3.4" ry="2.2" fill="' + c + '" stroke="' + d + '" stroke-width="1" transform="rotate(' + ((r() * 180) | 0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>'; }
      return s + BOWL + '<path d="M22 62 Q24 76 34 82" stroke="#fff" stroke-width="3" opacity=".6" fill="none" stroke-linecap="round"/>';
    },
    dish: function (c, d) {
      return BOWL + '<ellipse cx="50" cy="52" rx="38" ry="9" fill="#efe7da" stroke="#8d806d" stroke-width="2.5"/><ellipse cx="50" cy="52" rx="33" ry="6.5" fill="' + c + '" stroke="' + d + '" stroke-width="1.5"/><path d="M34 52 Q50 46 66 52" stroke="#fff" stroke-width="2.5" opacity=".6" fill="none"/>';
    },
    leaves: function (c, d, o) {
      var s = '';
      [-38, 38, 0].forEach(function (a, i) {
        s += '<g transform="rotate(' + a + ' 50 92)"><path d="M50 92 Q18 60 50 12 Q82 60 50 92Z" fill="' + (i === 2 ? c : d) + '" stroke="' + (o.line || '#2e5a2e') + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 90 V24 M50 60 L36 46 M50 50 L64 38 M50 70 L38 62" stroke="' + (o.line || '#2e5a2e') + '" stroke-width="1.8" fill="none" opacity=".7"/></g>';
      });
      return s;
    },
    egg: function (c, d) {
      return '<path d="M50 10 Q80 12 80 56 Q80 92 50 92 Q20 92 20 56 Q20 12 50 10Z" fill="' + c + '" stroke="' + d + '" stroke-width="3"/><ellipse cx="40" cy="38" rx="7" ry="12" fill="#fff" opacity=".45" transform="rotate(15 40 38)"/>';
    },
    bulb: function (c, d, o) {
      return '<path d="M50 10 Q56 26 74 44 Q88 66 72 82 Q50 96 28 82 Q12 66 26 44 Q44 26 50 10Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/><path d="M50 14 Q38 50 42 90 M50 14 Q62 50 58 90 M50 14 Q28 48 30 80 M50 14 Q72 48 70 80" stroke="' + d + '" stroke-width="2" fill="none" opacity=".6"/><path d="M44 90 l-2 6 M50 92 v6 M56 90 l2 6" stroke="' + d + '" stroke-width="2" stroke-linecap="round"/>';
    },
    fish: function (c, d) {
      return '<path d="M78 50 L96 32 L96 68Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/><path d="M10 50 Q36 18 70 38 Q82 46 78 50 Q82 54 70 62 Q36 82 10 50Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/><circle cx="26" cy="46" r="3.5" fill="#222"/><path d="M40 38 Q46 50 40 62 M52 40 Q58 50 52 60 M64 44 Q68 50 64 56" stroke="#fff" stroke-width="2.5" opacity=".6" fill="none"/>';
    },
    shrimp: function (c, d) {
      return '<path d="M24 74 Q8 34 48 26 Q84 22 82 52 Q80 68 62 64" stroke="' + d + '" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M24 74 Q8 34 48 26 Q84 22 82 52 Q80 68 62 64" stroke="' + c + '" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M30 48 l8 6 M46 36 l4 10 M62 34 l0 11 M74 42 l-6 6" stroke="' + d + '" stroke-width="2.5" stroke-linecap="round"/><path d="M60 66 L50 80 M60 66 L66 82 M60 66 L76 76" stroke="' + d + '" stroke-width="3" stroke-linecap="round"/><circle cx="26" cy="68" r="3" fill="#222"/>';
    },
    noodles: function (c, d) {
      var s = '';
      for (var i = 0; i < 4; i++) s += '<path d="M' + (18 + i * 2) + ' ' + (44 - i * 6) + ' q10 -18 20 0 t20 0 t20 0" stroke="' + c + '" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M' + (18 + i * 2) + ' ' + (44 - i * 6) + ' q10 -18 20 0 t20 0 t20 0" stroke="' + d + '" stroke-width="1.2" fill="none" opacity=".5"/>';
      return s + BOWL;
    },
    sheet: function (c, d, o) {
      var s, r = rng(11);
      if (o.rect) {
        s = '<rect x="12" y="22" width="76" height="56" rx="' + (o.r || 4) + '" fill="' + c + '" stroke="' + d + '" stroke-width="3"/>';
        if (o.grid) s += '<path d="M30 22 V78 M50 22 V78 M70 22 V78 M12 40 H88 M12 60 H88" stroke="' + d + '" stroke-width="1.5" opacity=".5"/>';
        if (o.wavy) s += '<path d="M12 30 q6 -6 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 M12 70 q6 6 12 0 t12 0 t12 0 t12 0 t12 0 t12 0" stroke="' + d + '" stroke-width="2.5" fill="none"/>';
        if (o.crust) s += '<rect x="20" y="30" width="60" height="40" rx="3" fill="' + o.crust + '"/>';
      } else {
        s = '<ellipse cx="50" cy="55" rx="40" ry="34" fill="' + c + '" stroke="' + d + '" stroke-width="3"/>';
        for (var i = 0; i < 9; i++) s += '<circle cx="' + (24 + r() * 52).toFixed(1) + '" cy="' + (36 + r() * 38).toFixed(1) + '" r="' + (2 + r() * 3).toFixed(1) + '" fill="' + d + '" opacity=".35"/>';
      }
      return s;
    },
    glass: function (c, d) {
      return '<path d="M26 14 L74 14 L68 90 L32 90Z" fill="#eaf4f7" opacity=".75" stroke="#6d8791" stroke-width="3" stroke-linejoin="round"/><path d="M29.5 42 L70.5 42 L68 90 L32 90Z" fill="' + c + '" stroke="' + d + '" stroke-width="2"/><ellipse cx="50" cy="42" rx="20.5" ry="4" fill="' + c + '" stroke="' + d + '" stroke-width="2"/><path d="M36 24 L38 80" stroke="#fff" stroke-width="3" opacity=".55" stroke-linecap="round"/>';
    },
    pod: function (c, d) {
      return '<path d="M30 30 Q72 18 82 58 Q84 86 70 90 Q62 70 42 52 Q26 44 30 30Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/><path d="M30 30 Q24 20 16 20" stroke="#3f8f3a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M48 32 Q66 34 72 54" stroke="#fff" stroke-width="3" opacity=".45" fill="none" stroke-linecap="round"/>';
    },
    sticks: function (c, d) {
      var s = '';
      [-22, 0, 20].forEach(function (a, i) {
        s += '<g transform="rotate(' + a + ' 50 50) translate(0 ' + (i * 9 - 9) + ')"><rect x="10" y="42" width="80" height="12" rx="6" fill="' + c + '" stroke="' + d + '" stroke-width="2.5"/><path d="M16 48 H84" stroke="' + d + '" stroke-width="1.5" opacity=".6"/></g>';
      });
      return s;
    },
    berry: function (c, d) {
      var s = '<path d="M50 92 Q12 62 16 40 Q24 24 50 30 Q76 24 84 40 Q88 62 50 92Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/>';
      [[34, 46], [50, 44], [66, 46], [40, 60], [58, 60], [50, 74], [30, 58], [70, 58]].forEach(function (p) { s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="2" ry="3" fill="#ffe08a"/>'; });
      return s + '<path d="M50 30 Q38 14 26 24 Q40 26 50 30Z M50 30 Q62 14 74 24 Q60 26 50 30Z M50 30 Q50 14 50 10" fill="#4caf50" stroke="#2e7d32" stroke-width="2.5" stroke-linejoin="round"/>';
    },
    mush: function (c, d) {
      return '<rect x="38" y="52" width="24" height="34" rx="9" fill="#f3e6d0" stroke="#a88d67" stroke-width="3"/><path d="M10 56 Q10 14 50 14 Q90 14 90 56Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/><circle cx="34" cy="34" r="4" fill="#fff" opacity=".35"/><circle cx="62" cy="30" r="3" fill="#fff" opacity=".3"/><circle cx="70" cy="44" r="3" fill="#fff" opacity=".3"/>';
    },
    blob: function (c, d) {
      return '<path d="M14 58 Q12 40 28 38 Q30 22 44 26 Q58 14 66 30 Q84 28 84 46 Q96 56 84 68 Q80 84 62 78 Q46 90 34 78 Q16 78 14 58Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/><path d="M30 52 q10 4 18 0 M48 66 q10 4 20 -2 M46 40 q8 4 14 0" stroke="' + d + '" stroke-width="2" fill="none" opacity=".6"/>';
    },
    sack: function (c, d) {
      return '<path d="M26 22 L74 22 L84 88 Q50 98 16 88Z" fill="' + c + '" stroke="' + d + '" stroke-width="3" stroke-linejoin="round"/><path d="M26 22 Q50 34 74 22" stroke="' + d + '" stroke-width="3" fill="#e7d8b9"/><rect x="30" y="46" width="40" height="26" rx="4" fill="#fff" opacity=".85"/><path d="M50 68 V50 M50 56 l-6 -4 M50 56 l6 -4 M50 62 l-6 -4 M50 62 l6 -4" stroke="#b58a2e" stroke-width="2" stroke-linecap="round" fill="none"/>';
    }
  };

  // id, display name, template, main colour, dark colour, options
  var LIST = [
    ['chicken', 'Chicken', 'drum', '#e0a368', '#a96a2d'], ['yogurt', 'Yogurt', 'dish', '#fffdf5', '#d9d2bd'],
    ['onion', 'Onion', 'bulb', '#d79ad0', '#8a4a85'], ['tomato', 'Tomato', 'round', '#e5483b', '#a52a20', { stem: 1 }],
    ['butter', 'Butter', 'block', '#f6d86b', '#c9a22b', { l: '#fbe99a' }], ['garam', 'Garam masala', 'pile', '#a8622a', '#6b3a14'],
    ['chili', 'Chili powder', 'pile', '#d3361f', '#8c1d0e'], ['cream', 'Cream', 'dish', '#fff6dc', '#e0cf9f'],
    ['spinach', 'Spinach', 'leaves', '#3f9b45', '#2f7d36'], ['paneer', 'Paneer', 'block', '#fbf5e4', '#cfc29d', { l: '#fffdf4' }],
    ['garlic', 'Garlic', 'bulb', '#faf3e2', '#b9a97f'], ['cumin', 'Cumin', 'pile', '#b88a44', '#6d4a1a'],
    ['rice', 'Rice', 'bowl', '#fffaf0', '#cfc6b0'], ['lentil', 'Lentils', 'bowl', '#d9a441', '#9a6f1e'],
    ['potato', 'Potato', 'round', '#c99a5b', '#8a6330', { rx: 36, ry: 27, spots: 1 }], ['mustard', 'Mustard seeds', 'pile', '#4a3a28', '#241a0e'],
    ['turmeric', 'Turmeric', 'pile', '#f0a912', '#b07400'], ['oil', 'Oil', 'bottle', '#f3c232', '#b88a00', { cap: '#d97706' }],
    ['saffron', 'Saffron', 'pile', '#e8590c', '#a63d00'], ['mint', 'Mint', 'leaves', '#58c26a', '#3a9a4c'],
    ['chickpea', 'Chickpeas', 'bowl', '#e2bd7a', '#a47f3b'], ['ginger', 'Ginger', 'blob', '#e0b97a', '#a37c3d'],
    ['cilantro', 'Cilantro', 'leaves', '#6cc070', '#43a047'], ['egg', 'Eggs', 'egg', '#fbf1de', '#c9b48a'],
    ['carrot', 'Carrot', 'long', '#f4811f', '#b4570c', { top: '#4caf50' }], ['peas', 'Green peas', 'bowl', '#7ac74f', '#4c9a2a'],
    ['soy', 'Soy sauce', 'bottle', '#3b2a22', '#1b100b', { cap: '#c62828' }], ['scallion', 'Scallions', 'long', '#f3f7e6', '#7bb661', { top: '#5cb85c' }],
    ['peanut', 'Peanuts', 'bowl', '#c88c4c', '#8a5a2a'], ['tofu', 'Tofu', 'block', '#fbf8ee', '#d9cfae', { l: '#fffefa' }],
    ['pork', 'Pork', 'steak', '#f0a3a3', '#b86767'], ['chilipaste', 'Chili bean paste', 'dish', '#c8321d', '#7f1b0d'],
    ['peppercorn', 'Sichuan pepper', 'pile', '#7a4a3a', '#3f2118'], ['flour', 'Flour', 'sack', '#f7f1e3', '#bfae86'],
    ['cabbage', 'Cabbage', 'leaves', '#b7e08a', '#8cc152', { line: '#5a8a36' }], ['noodles', 'Noodles', 'noodles', '#f3d27a', '#b8933a'],
    ['tahini', 'Tahini', 'dish', '#d9b88a', '#a9895a'], ['lemon', 'Lemon', 'round', '#fbe03a', '#c4a600', { rx: 36, ry: 27, nubs: 1 }],
    ['paprika', 'Paprika', 'pile', '#d9481c', '#8f2b0b'], ['parsley', 'Parsley', 'leaves', '#4fae52', '#2e8b3d'],
    ['bulgur', 'Bulgur', 'bowl', '#c99a52', '#8d6628'], ['pita', 'Pita bread', 'sheet', '#f1d9a8', '#b8934f', {}],
    ['cucumber', 'Cucumber', 'long', '#6cbf5a', '#3e8a32', { fat: 1 }], ['kataifi', 'Kataifi pastry', 'noodles', '#f1c76b', '#b88a2a'],
    ['cheese', 'Cheese', 'block', '#fbc531', '#c68f0e', { holes: 1, l: '#fde38a' }], ['sugar', 'Sugar', 'pile', '#fffdf8', '#cfc8b4'],
    ['pistachio', 'Pistachios', 'bowl', '#9ccc65', '#5e8f2a'], ['water', 'Water', 'glass', '#a6dcf5', '#5aa9d1'],
    ['mozzarella', 'Mozzarella', 'round', '#fdfdf3', '#cfcdb4', {}], ['basil', 'Basil', 'leaves', '#3fae4a', '#2a8636'],
    ['yeast', 'Yeast', 'pile', '#e9d3a6', '#a58a55'], ['salt', 'Salt', 'pile', '#ffffff', '#b9b9b9'],
    ['spaghetti', 'Spaghetti', 'noodles', '#f6df9c', '#bf9b45'], ['bacon', 'Bacon', 'bacon', '#e9857b', '#a53d33'],
    ['parmesan', 'Parmesan', 'block', '#f7e3a1', '#c4a64a', { l: '#fbf0c5' }], ['pepper', 'Black pepper', 'pile', '#3a3a3a', '#111'],
    ['mushroom', 'Mushrooms', 'mush', '#b98b62', '#7d5835'], ['stock', 'Stock', 'glass', '#d9a35b', '#a06b25'],
    ['lasagna', 'Lasagna sheets', 'sheet', '#f4e3a3', '#bfa244', { rect: 1, wavy: 1 }], ['beef', 'Beef', 'steak', '#c0504d', '#7d2220'],
    ['milk', 'Milk', 'glass', '#fffefb', '#d7d7cf'], ['coffee', 'Coffee', 'glass', '#5a3a26', '#2d1a0e'],
    ['mascarpone', 'Mascarpone', 'dish', '#fffbea', '#e3d7a8'], ['biscuit', 'Ladyfingers', 'sheet', '#f1d08a', '#b88d36', { rect: 1, r: 18 }],
    ['cocoa', 'Cocoa', 'pile', '#5b3420', '#2f180b'], ['tortilla', 'Tortillas', 'sheet', '#f4e2b6', '#b99a58', {}],
    ['lime', 'Lime', 'round', '#8bd24a', '#4e8f1a', { rx: 36, ry: 27, nubs: 1 }], ['avocado', 'Avocado', 'round', '#6aa84f', '#3d6b2b', { pit: 1, rx: 30, ry: 36 }],
    ['bellpepper', 'Bell pepper', 'round', '#f0412b', '#9c2012', { stem: 1 }], ['cinnamon', 'Cinnamon', 'sticks', '#b5693a', '#6d3a1a'],
    ['nori', 'Nori', 'sheet', '#27402f', '#101c14', { rect: 1, grid: 1 }], ['salmon', 'Salmon', 'fish', '#f58f6b', '#b85a3a'],
    ['vinegar', 'Rice vinegar', 'bottle', '#f3ecc8', '#a79e68', { cap: '#6d4c41' }], ['shrimp', 'Shrimp', 'shrimp', '#f79c7a', '#c15f3d'],
    ['mayo', 'Mayo', 'dish', '#fffbe0', '#e6d994'], ['sesame', 'Sesame seeds', 'pile', '#f5ecd2', '#a89a6a'],
    ['miso', 'Miso paste', 'dish', '#c9a064', '#8a6a35'], ['strawberry', 'Strawberries', 'berry', '#e53550', '#a01a30'],
    ['eggplant', 'Eggplant', 'long', '#6b3a8f', '#3d1d58', { fat: 1, top: '#4a8c3a' }], ['zucchini', 'Zucchini', 'long', '#4f9a3c', '#2c6422', { fat: 1 }],
    ['thyme', 'Thyme', 'leaves', '#7fae64', '#5d8c48'], ['bread', 'Bread', 'sheet', '#d8a65b', '#8f6322', { rect: 1, r: 14, crust: '#f3dba8' }],
    ['vanilla', 'Vanilla', 'sticks', '#3b2418', '#1b0f08']
  ];

  var D = {}, ids = [];
  LIST.forEach(function (x) { D[x[0]] = { name: x[1], tpl: x[2], c: x[3], d: x[4], o: x[5] || {} }; ids.push(x[0]); });

  function svg(id) {
    var x = D[id];
    if (!x) return wrap('<text x="50" y="60" text-anchor="middle" font-size="40">?</text>');
    return wrap(T[x.tpl](x.c, x.d, x.o));
  }

  /* A plated dish, viewBox 0 0 200 200 */
  function plate(cols, seed) {
    var r = rng((seed || 3) * 97 + 11), s = '<circle cx="100" cy="100" r="94" fill="#fff" stroke="#d6cbb8" stroke-width="4"/><circle cx="100" cy="100" r="74" fill="#f6f1e7" stroke="#e4dac7" stroke-width="2"/>';
    cols.forEach(function (c, i) {
      var n = 6 + i * 3;
      for (var k = 0; k < n; k++) {
        var a = r() * 6.28, d = r() * (i === 0 ? 44 : 34), x = 100 + Math.cos(a) * d, y = 100 + Math.sin(a) * d;
        s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + (11 + r() * 9).toFixed(1) + '" ry="' + (8 + r() * 8).toFixed(1) + '" fill="' + c + '" stroke="rgba(0,0,0,.16)" stroke-width="1.5" transform="rotate(' + ((r() * 180) | 0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
      }
    });
    for (var g = 0; g < 7; g++) { var ga = r() * 6.28, gd = r() * 38; s += '<ellipse cx="' + (100 + Math.cos(ga) * gd).toFixed(1) + '" cy="' + (100 + Math.sin(ga) * gd).toFixed(1) + '" rx="5" ry="2.6" fill="#4caf50" stroke="#2e7d32" stroke-width="1" transform="rotate(' + ((r() * 180) | 0) + ' 100 100)"/>'; }
    return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + s + '</svg>';
  }

  /* Top-down cooking vessel with its contents, viewBox 0 0 240 240 */
  var V = {
    pan: { out: '#3d3d3d', rim: '#222', inn: '#8a8a8a', handle: 'M200 108 h40 v24 h-40Z' },
    wok: { out: '#2b2b2b', rim: '#111', inn: '#555', handle: 'M200 110 h40 v20 h-40Z' },
    pot: { out: '#aab0b6', rim: '#6c7378', inn: '#c9ced2', handle: 'M0 112 h26 v16 h-26Z M214 112 h26 v16 h-26Z' },
    bowl: { out: '#e8dfd0', rim: '#b8ab94', inn: '#f7f0e4', handle: '' }
  };
  function vessel(type, colors, opt) {
    opt = opt || {};
    var v = V[type] || V.pan, id = 'vc' + (uid++);
    var s = '<defs><clipPath id="' + id + '"><circle cx="120" cy="120" r="80"/></clipPath></defs>';
    if (v.handle) s += '<path d="' + v.handle + '" fill="' + (type === 'pot' ? '#5d6368' : '#2a2a2a') + '" stroke="#111" stroke-width="3" stroke-linejoin="round"/>';
    s += '<circle cx="120" cy="120" r="98" fill="' + v.out + '" stroke="' + v.rim + '" stroke-width="5"/><circle cx="120" cy="120" r="84" fill="' + v.inn + '" stroke="' + v.rim + '" stroke-width="3"/>';
    s += '<g clip-path="url(#' + id + ')"><g class="cg" style="transform-origin:120px 120px">';
    (colors || []).forEach(function (c, i) {
      var r = rng(i * 31 + 5);
      for (var k = 0; k < 9; k++) {
        var a = r() * 6.28, d = Math.sqrt(r()) * 62, x = 120 + Math.cos(a) * d, y = 120 + Math.sin(a) * d;
        s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + (10 + r() * 10).toFixed(1) + '" ry="' + (8 + r() * 8).toFixed(1) + '" fill="' + c + '" stroke="rgba(0,0,0,.18)" stroke-width="1.5" transform="rotate(' + ((r() * 180) | 0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
      }
    });
    s += '</g></g>';
    if (opt.steam) s += '<g class="steam" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"><path d="M90 70 q-10 -14 0 -28 q10 -14 0 -28"/><path d="M120 66 q-10 -14 0 -28 q10 -14 0 -28"/><path d="M150 70 q-10 -14 0 -28 q10 -14 0 -28"/></g>';
    return '<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + s + '</svg>';
  }

  return {
    ids: ids,
    svg: svg,
    plate: plate,
    vessel: vessel,
    name: function (id) { return D[id] ? D[id].name : id; },
    color: function (id) { return D[id] ? D[id].c : '#ccc'; },
    has: function (id) { return !!D[id]; }
  };
})();
