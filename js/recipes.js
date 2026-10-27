/* Recipe data: 7 cuisines x 5 dishes. Each step is a mini-game. */
var add = function (t, i) { return { g: 'add', t: t, ids: i.split(',') }; };
var chop = function (t, i, n) { return { g: 'chop', t: t, id: i, n: n || 5 }; };
var stir = function (t, n) { return { g: 'stir', t: t, n: n || 3 }; };
var heat = function (t) { return { g: 'heat', t: t }; };
var sprinkle = function (t, i, n) { return { g: 'sprinkle', t: t, id: i, n: n || 5 }; };
var simmer = function (t, n) { return { g: 'simmer', t: t, n: n || 8 }; };
var flip = function (t) { return { g: 'flip', t: t }; };
var knead = function (t, n) { return { g: 'knead', t: t, n: n || 8 }; };

function R(id, name, time, diff, vessel, plate, ings, steps) {
  return {
    id: id, name: name, time: time, diff: diff, vessel: vessel, plate: plate, steps: steps,
    ings: ings.split('|').map(function (x) { var p = x.split(':'); return [p[0], p[1]]; })
  };
}

var CUISINES = [
  {
    id: 'indian', name: 'Indian', title: 'Spice & Soul', color: '#c2410c', accent: '#fbbf24', motif: 'mandala',
    blurb: 'Layers of toasted spices, slow-cooked sauces and warm breads. Indian cooking is all about building flavour one aromatic step at a time.',
    dishes: [
      R('butter-chicken', 'Butter Chicken', 45, 'Easy', 'pan', ['#d8622b', '#f4c27a', '#fff3d6'],
        'chicken:500 g, cubed|yogurt:½ cup|onion:1 large|tomato:4 ripe|butter:3 tbsp|garam:1 tsp garam masala|chili:1 tsp chili powder|cream:½ cup', [
          chop('Dice the onion finely so it melts into the sauce. Slice across the guide lines.', 'onion', 5),
          chop('Roughly chop the ripe tomatoes. The riper they are, the sweeter the sauce.', 'tomato', 4),
          add('Melt the butter in a heavy pan, then add the onion.', 'butter,onion'),
          heat('Cook on medium heat until the onion turns soft and golden. Release when the flame is in the green zone.'),
          add('Add the chicken, yogurt and tomatoes. The yogurt tenderises the meat as it cooks.', 'chicken,yogurt,tomato'),
          sprinkle('Season with chili powder for gentle heat.', 'chili', 4),
          simmer('Cover and simmer until the chicken is cooked through. Pop the bubbles to keep an eye on it!', 8),
          sprinkle('Finish with garam masala, added late so its aroma stays fresh.', 'garam', 5),
          add('Swirl in the cream for a silky, rich finish.', 'cream')
        ]),
      R('palak-paneer', 'Palak Paneer', 35, 'Easy', 'pan', ['#3f7d3a', '#f2e9c9', '#6aa84f'],
        'spinach:400 g|paneer:250 g|onion:1 medium|garlic:4 cloves|cumin:1 tsp|chili:½ tsp|cream:3 tbsp|oil:2 tbsp', [
          simmer('Blanch the spinach in hot water for a minute to keep its bright green colour.', 6),
          chop('Slice the paneer into neat cubes.', 'paneer', 4),
          add('Heat the oil and add the garlic and onion.', 'oil,garlic,onion'),
          sprinkle('Toast the cumin until fragrant.', 'cumin', 4),
          heat('Fry the paneer cubes until golden. Hold to heat, release in the green.'),
          add('Add the blanched spinach and a pinch of chili.', 'spinach,chili'),
          stir('Stir everything together until the spinach wilts into a rich curry.', 3),
          add('Fold in the cream and serve hot.', 'cream')
        ]),
      R('masala-dosa', 'Masala Dosa', 50, 'Medium', 'pan', ['#e0a94f', '#f2d27a', '#e8d9a8'],
        'rice:1 cup|lentil:½ cup urad dal|potato:3 boiled|onion:1 medium|mustard:1 tsp|turmeric:½ tsp|oil:2 tbsp', [
          add('Soak the rice and lentils together overnight to make the batter.', 'rice,lentil'),
          knead('Grind and work the batter until smooth, then let it ferment.', 8),
          chop('Dice the boiled potatoes for the filling.', 'potato', 4),
          sprinkle('Pop the mustard seeds in hot oil.', 'mustard', 4),
          add('Add the onion and potato to the spiced oil.', 'onion,potato,oil'),
          sprinkle('Add turmeric for its golden colour.', 'turmeric', 4),
          heat('Heat the flat griddle until a drop of water sizzles.'),
          flip('Spread the batter thin and flip when crisp. Time it right!')
        ]),
      R('biryani', 'Chicken Biryani', 75, 'Hard', 'pot', ['#f1c04f', '#d99a3b', '#fff1c8'],
        'rice:2 cups basmati|chicken:500 g|yogurt:1 cup|onion:2 large|saffron:a pinch|mint:1 handful|garam:2 tsp', [
          chop('Slice the onions thinly for golden fried onions.', 'onion', 5),
          heat('Fry the onions until deep golden brown.'),
          add('Marinate the chicken with yogurt and add it to the pot.', 'chicken,yogurt'),
          sprinkle('Add garam masala to the marinade.', 'garam', 5),
          simmer('Cook the chicken gently. Pop the bubbles!', 8),
          add('Layer the half-cooked rice over the chicken, then scatter the mint.', 'rice,mint'),
          sprinkle('Drizzle the saffron over the top for colour and perfume.', 'saffron', 3),
          simmer('Seal the pot and steam on low heat so the layers merge (dum).', 10)
        ]),
      R('chana-masala', 'Chana Masala', 40, 'Easy', 'pot', ['#b8641f', '#e0b36a', '#6aa84f'],
        'chickpea:2 cups cooked|onion:1 large|tomato:3 ripe|ginger:1 inch|cumin:1 tsp|chili:1 tsp|cilantro:a handful', [
          chop('Finely chop the onion.', 'onion', 5),
          chop('Slice the ginger into thin matchsticks.', 'ginger', 4),
          sprinkle('Bloom the cumin in hot oil.', 'cumin', 4),
          add('Add the onion and ginger and cook until soft.', 'onion,ginger'),
          add('Add the tomatoes and chili powder.', 'tomato,chili'),
          stir('Stir and cook the tomatoes into a thick paste.', 3),
          add('Tip in the chickpeas.', 'chickpea'),
          simmer('Simmer so the chickpeas soak up the spiced sauce.', 8),
          sprinkle('Scatter fresh cilantro on top.', 'cilantro', 5)
        ])
    ]
  },
  {
    id: 'chinese', name: 'Chinese', title: 'Wok & Flame', color: '#b91c1c', accent: '#fcd34d', motif: 'lantern',
    blurb: 'Fast, fiery wok cooking, silky sauces and hand-folded dumplings. The secret is high heat and having everything ready before you start.',
    dishes: [
      R('fried-rice', 'Egg Fried Rice', 20, 'Easy', 'wok', ['#f3dc9a', '#f2b632', '#7ac74f'],
        'rice:3 cups cold cooked|egg:2|carrot:1 small|peas:½ cup|soy:2 tbsp|scallion:3 stalks|oil:2 tbsp', [
          chop('Dice the carrot into small cubes so it cooks quickly.', 'carrot', 4),
          chop('Slice the scallions into rings.', 'scallion', 4),
          heat('Get the wok smoking hot. This is the secret of great fried rice.'),
          add('Add the oil, then the carrot and peas.', 'oil,carrot,peas'),
          add('Scramble in the eggs.', 'egg'),
          add('Add the cold, day-old rice. It fries better than fresh rice.', 'rice'),
          flip('Toss the wok to fling the rice into the air. Hit the beat!'),
          sprinkle('Drizzle with soy sauce around the edge of the wok.', 'soy', 4),
          sprinkle('Finish with scallion.', 'scallion', 4)
        ]),
      R('kung-pao', 'Kung Pao Chicken', 30, 'Medium', 'wok', ['#a63a1e', '#f0d28a', '#7a4a2a'],
        'chicken:400 g|peanut:½ cup|chili:6 dried|ginger:1 inch|garlic:3 cloves|soy:3 tbsp|scallion:3 stalks', [
          chop('Cut the chicken into bite-size cubes.', 'chicken', 4),
          add('Marinate the chicken in soy sauce.', 'chicken,soy'),
          chop('Mince the garlic.', 'garlic', 5),
          heat('Heat the wok until it just starts to smoke.'),
          add('Stir-fry the chili, ginger and garlic for a few seconds.', 'chili,ginger,garlic'),
          add('Add the chicken and stir-fry until golden.', 'chicken'),
          flip('Toss the wok so everything cooks evenly.'),
          add('Add the peanuts and scallion at the very end to keep them crunchy.', 'peanut,scallion')
        ]),
      R('mapo-tofu', 'Mapo Tofu', 30, 'Medium', 'wok', ['#c8321d', '#f6f0dd', '#6a3d2a'],
        'tofu:400 g silken|pork:150 g minced|chilipaste:2 tbsp|garlic:3 cloves|scallion:3 stalks|peppercorn:1 tsp|soy:1 tbsp', [
          chop('Cut the tofu into gentle cubes.', 'tofu', 4),
          heat('Heat the wok and fry the pork until crisp.'),
          add('Add the pork, garlic and chili bean paste.', 'pork,garlic,chilipaste'),
          stir('Stir until the oil turns red and fragrant.', 3),
          add('Slide in the tofu and soy sauce, handling gently so it does not break.', 'tofu,soy'),
          simmer('Simmer so the tofu soaks up the sauce.', 7),
          sprinkle('Dust with ground Sichuan pepper for the numbing tingle.', 'peppercorn', 4),
          sprinkle('Garnish with scallion.', 'scallion', 4)
        ]),
      R('dumplings', 'Pork Dumplings', 60, 'Hard', 'pot', ['#f7efd9', '#e9d6a6', '#9ac26a'],
        'flour:2 cups|pork:250 g minced|cabbage:2 cups shredded|ginger:1 inch|soy:2 tbsp|scallion:3 stalks', [
          add('Mix flour and water to start the dough.', 'flour'),
          knead('Knead the dough until smooth and springy.', 10),
          chop('Finely shred the cabbage for the filling.', 'cabbage', 5),
          add('Mix the pork, cabbage, ginger, soy and scallion for the filling.', 'pork,cabbage,ginger,soy,scallion'),
          stir('Stir the filling in one direction to make it bouncy.', 3),
          knead('Roll out the wrappers, fill and pleat the dumplings.', 8),
          simmer('Steam the dumplings until the wrappers turn translucent.', 9)
        ]),
      R('chow-mein', 'Chow Mein', 25, 'Easy', 'wok', ['#d9a741', '#7ac74f', '#f58a1f'],
        'noodles:250 g|cabbage:2 cups|carrot:1|garlic:2 cloves|soy:3 tbsp|scallion:3 stalks|oil:2 tbsp', [
          simmer('Boil the noodles until just tender, then drain.', 6),
          chop('Slice the carrot into thin matchsticks.', 'carrot', 5),
          heat('Heat the wok with oil until shimmering.'),
          add('Add the garlic, carrot and cabbage.', 'oil,garlic,carrot,cabbage'),
          add('Add the noodles.', 'noodles'),
          sprinkle('Season with soy sauce.', 'soy', 5),
          flip('Toss the noodles high so they get a smoky wok flavour.'),
          sprinkle('Top with scallion.', 'scallion', 4)
        ])
    ]
  },
  {
    id: 'arabic', name: 'Arabic', title: 'Desert & Oasis', color: '#0f766e', accent: '#fde68a', motif: 'star',
    blurb: 'Fresh herbs, creamy tahini, grilled meats and honeyed pastries. A table made for sharing with everyone.',
    dishes: [
      R('hummus', 'Hummus', 15, 'Easy', 'bowl', ['#e8cf9a', '#c97b2e', '#6aa84f'],
        'chickpea:2 cups cooked|tahini:⅓ cup|lemon:1 juiced|garlic:2 cloves|oil:3 tbsp|cumin:½ tsp|paprika:a pinch', [
          add('Add the chickpeas to the bowl.', 'chickpea'),
          add('Add the tahini, lemon juice and garlic.', 'tahini,lemon,garlic'),
          stir('Blend and stir until silky smooth.', 4),
          sprinkle('Season with cumin.', 'cumin', 4),
          add('Swirl a generous pool of olive oil on top.', 'oil'),
          sprinkle('Dust with paprika to finish.', 'paprika', 3)
        ]),
      R('falafel', 'Falafel', 40, 'Medium', 'pan', ['#8a6a2f', '#b5883b', '#6aa84f'],
        'chickpea:2 cups soaked|parsley:1 bunch|onion:1 small|garlic:3 cloves|cumin:1 tsp|oil:for frying', [
          chop('Chop the parsley finely.', 'parsley', 5),
          chop('Dice the onion.', 'onion', 4),
          add('Blend the chickpeas with the herbs, onion and garlic.', 'chickpea,parsley,onion,garlic'),
          sprinkle('Season generously with cumin.', 'cumin', 5),
          knead('Shape the mixture into small patties.', 8),
          heat('Heat the oil until it is shimmering.'),
          add('Carefully add the falafel to the hot oil.', 'oil'),
          flip('Flip the falafel to get an even golden crust.')
        ]),
      R('shawarma', 'Chicken Shawarma', 50, 'Medium', 'pan', ['#c98a42', '#f3e7c9', '#e5483b'],
        'chicken:500 g|yogurt:½ cup|garlic:4 cloves|lemon:1 juiced|cumin:2 tsp|pita:4|cucumber:1|tomato:2', [
          add('Make the marinade with yogurt, garlic and lemon.', 'yogurt,garlic,lemon'),
          sprinkle('Add cumin to the marinade.', 'cumin', 5),
          add('Add the chicken and let it marinate.', 'chicken'),
          heat('Sear the chicken on a hot grill pan.'),
          flip('Flip the chicken so it gets charred on both sides.'),
          chop('Slice the cucumber for stuffing.', 'cucumber', 5),
          chop('Slice the tomatoes.', 'tomato', 4),
          add('Pile everything into warm pita.', 'pita,cucumber,tomato')
        ]),
      R('tabbouleh', 'Tabbouleh', 25, 'Easy', 'bowl', ['#4caf50', '#e5483b', '#e0c27a'],
        'parsley:2 bunches|bulgur:¼ cup|tomato:3 ripe|mint:½ bunch|lemon:2 juiced|oil:¼ cup|onion:1 small', [
          chop('Chop the parsley very finely. It is the star of the dish.', 'parsley', 6),
          chop('Dice the tomatoes.', 'tomato', 4),
          chop('Finely chop the onion.', 'onion', 4),
          add('Add the bulgur (soaked), parsley, tomatoes and onion to the bowl.', 'bulgur,parsley,tomato,onion'),
          add('Add the mint.', 'mint'),
          add('Dress with lemon juice and olive oil.', 'lemon,oil'),
          stir('Toss gently to mix.', 3)
        ]),
      R('kunafa', 'Kunafa', 50, 'Hard', 'pan', ['#f0b24d', '#fff3c9', '#8bc34a'],
        'kataifi:250 g|butter:½ cup melted|cheese:300 g|sugar:1 cup|water:½ cup|pistachio:¼ cup', [
          simmer('Boil the sugar and water to make a sticky syrup.', 7),
          knead('Rub the kataifi strands with melted butter.', 8),
          add('Press half the pastry into the pan.', 'kataifi,butter'),
          add('Spread the cheese filling on top.', 'cheese'),
          heat('Cook until the base turns golden and crisp.'),
          flip('Flip the whole kunafa with a plate in one smooth move!'),
          add('Pour over the cool syrup.', 'sugar,water'),
          sprinkle('Scatter crushed pistachios on top.', 'pistachio', 5)
        ])
    ]
  },
  {
    id: 'italian', name: 'Italian', title: 'La Cucina', color: '#15803d', accent: '#fecaca', motif: 'stripes',
    blurb: 'Few ingredients, treated with respect. Great Italian food comes from fresh tomatoes, good olive oil and patient cooking.',
    dishes: [
      R('margherita', 'Margherita Pizza', 90, 'Medium', 'bowl', ['#e5483b', '#fdfdf3', '#3fae4a'],
        'flour:3 cups|yeast:1 tsp|salt:1 tsp|water:1 cup warm|tomato:4 ripe|mozzarella:200 g|basil:a handful|oil:2 tbsp', [
          add('Combine flour, yeast and salt, then add warm water.', 'flour,yeast,salt,water'),
          knead('Knead the dough until it is smooth and stretchy.', 10),
          chop('Crush and chop the tomatoes for the sauce.', 'tomato', 4),
          add('Spread the tomato over the dough.', 'tomato'),
          chop('Slice the mozzarella.', 'mozzarella', 4),
          add('Add the mozzarella and a drizzle of oil.', 'mozzarella,oil'),
          heat('Bake in a very hot oven. Hot is the key to a crisp crust.'),
          sprinkle('Scatter fresh basil over the hot pizza.', 'basil', 5)
        ]),
      R('carbonara', 'Spaghetti Carbonara', 25, 'Medium', 'pan', ['#f6df9c', '#e9857b', '#f2b632'],
        'spaghetti:200 g|egg:3 yolks|bacon:100 g|parmesan:½ cup|pepper:1 tsp|salt:for the water', [
          add('Salt the boiling water generously. It should taste like the sea.', 'salt'),
          simmer('Boil the spaghetti until al dente.', 7),
          chop('Slice the bacon into strips.', 'bacon', 5),
          heat('Crisp the bacon in a pan.'),
          add('Whisk the eggs and parmesan, then add the pasta.', 'egg,parmesan,spaghetti'),
          stir('Toss quickly off the heat so the egg makes a creamy sauce.', 3),
          sprinkle('Grind plenty of black pepper on top.', 'pepper', 6)
        ]),
      R('risotto', 'Mushroom Risotto', 45, 'Medium', 'pot', ['#e7d7a8', '#b98b62', '#f2e9c9'],
        'rice:1 cup arborio|mushroom:200 g|onion:1 small|stock:4 cups hot|parmesan:½ cup|butter:2 tbsp|garlic:2 cloves', [
          chop('Dice the onion.', 'onion', 4),
          chop('Slice the mushrooms.', 'mushroom', 5),
          add('Soften the onion and garlic in butter, then add the mushrooms.', 'butter,onion,garlic,mushroom'),
          add('Toast the rice for a minute.', 'rice'),
          add('Add the hot stock one ladle at a time.', 'stock'),
          stir('Stir constantly. This releases the starch for a creamy texture.', 5),
          simmer('Keep it at a gentle bubble until the rice is al dente.', 8),
          add('Finish with parmesan.', 'parmesan')
        ]),
      R('lasagna', 'Lasagna', 100, 'Hard', 'pan', ['#b23b2c', '#f4e3a3', '#fbc531'],
        'lasagna:9 sheets|beef:500 g minced|tomato:5 ripe|onion:1 large|milk:2 cups|mozzarella:250 g|basil:a handful', [
          chop('Dice the onion for the ragù.', 'onion', 4),
          heat('Brown the beef with the onion.'),
          add('Add the beef, onion and tomatoes.', 'beef,onion,tomato'),
          simmer('Simmer the ragù slowly to bring out its flavour.', 9),
          stir('Stir the milk into a white sauce.', 3),
          add('Layer the pasta sheets with the sauces.', 'lasagna,milk'),
          add('Top with mozzarella and basil.', 'mozzarella,basil'),
          heat('Bake until bubbling and golden.')
        ]),
      R('tiramisu', 'Tiramisu', 30, 'Easy', 'bowl', ['#5b3420', '#fff3d1', '#d8b46a'],
        'mascarpone:250 g|egg:3|sugar:½ cup|coffee:1 cup strong|biscuit:200 g ladyfingers|cocoa:2 tbsp', [
          stir('Whisk the egg yolks and sugar until pale and creamy.', 4),
          add('Fold in the mascarpone.', 'egg,sugar,mascarpone'),
          add('Dip the ladyfingers briefly in coffee.', 'coffee,biscuit'),
          knead('Layer the biscuits and cream, gently pressing down.', 6),
          sprinkle('Dust generously with cocoa.', 'cocoa', 6)
        ])
    ]
  },
  {
    id: 'mexican', name: 'Mexican', title: 'Fiesta Kitchen', color: '#a21caf', accent: '#fde047', motif: 'sun',
    blurb: 'Bright, bold flavours: lime, chili, corn and fresh herbs. Mexican food is vibrant, fun and made for sharing.',
    dishes: [
      R('tacos', 'Beef Tacos', 30, 'Easy', 'pan', ['#8a4a2a', '#e5483b', '#7ac74f'],
        'tortilla:6 small|beef:400 g minced|onion:1 small|tomato:2|cheese:1 cup grated|lime:1|cilantro:a handful|chili:1 tsp chili powder', [
          chop('Dice the onion.', 'onion', 4),
          heat('Heat the pan until hot.'),
          add('Brown the beef with the onion.', 'beef,onion'),
          sprinkle('Season the beef with chili powder.', 'chili', 4),
          chop('Dice the tomatoes for the topping.', 'tomato', 4),
          flip('Warm each tortilla and flip it once it puffs up.'),
          add('Fill the tortillas with beef, tomato and cheese, then squeeze over some lime.', 'tortilla,tomato,cheese,lime'),
          sprinkle('Add cilantro and a squeeze of lime.', 'cilantro', 4)
        ]),
      R('guacamole', 'Guacamole', 15, 'Easy', 'bowl', ['#6aa84f', '#e5483b', '#f5f0d5'],
        'avocado:3 ripe|onion:½ small|tomato:1|lime:1 juiced|cilantro:a handful|chili:1 fresh|salt:to taste', [
          chop('Finely chop the onion.', 'onion', 5),
          chop('Dice the tomato.', 'tomato', 4),
          add('Scoop the avocados into the bowl.', 'avocado'),
          knead('Mash the avocado with a fork to your preferred texture.', 8),
          add('Fold in the onion, tomato and chili.', 'onion,tomato,chili'),
          add('Add lime juice. It keeps the avocado green.', 'lime'),
          sprinkle('Season with salt.', 'salt', 4),
          sprinkle('Top with cilantro.', 'cilantro', 4)
        ]),
      R('quesadilla', 'Chicken Quesadilla', 20, 'Easy', 'pan', ['#f0b432', '#e5483b', '#f4e2b6'],
        'tortilla:2 large|cheese:1½ cups|chicken:1 cup cooked|bellpepper:1|onion:½|butter:1 tbsp', [
          chop('Slice the bell pepper into strips.', 'bellpepper', 5),
          chop('Slice the onion.', 'onion', 4),
          heat('Melt the butter in a hot pan.'),
          add('Cook the pepper and onion until soft.', 'butter,bellpepper,onion'),
          add('Fill a tortilla with cheese and chicken.', 'tortilla,cheese,chicken'),
          flip('Flip carefully when the bottom is golden.')
        ]),
      R('enchiladas', 'Chicken Enchiladas', 45, 'Medium', 'pan', ['#c0392b', '#f3e0ae', '#7ac74f'],
        'tortilla:8|chicken:2 cups shredded|tomato:5 ripe|cheese:2 cups|onion:1|chili:2 tsp|cilantro:a handful', [
          chop('Chop the tomatoes for the sauce.', 'tomato', 5),
          chop('Chop the onion.', 'onion', 4),
          add('Cook tomatoes and onion into a sauce.', 'tomato,onion'),
          sprinkle('Season the sauce with chili.', 'chili', 5),
          simmer('Simmer until the sauce thickens.', 7),
          add('Roll the chicken and cheese in tortillas.', 'tortilla,chicken,cheese'),
          heat('Bake until the cheese bubbles.'),
          sprinkle('Finish with cilantro.', 'cilantro', 4)
        ]),
      R('churros', 'Churros', 40, 'Medium', 'pot', ['#d9923a', '#f3d9a0', '#7a4a2a'],
        'flour:1 cup|butter:2 tbsp|water:1 cup|egg:1|sugar:½ cup|cinnamon:1 tsp|oil:for frying', [
          add('Boil the water with butter.', 'water,butter'),
          add('Add the flour all at once.', 'flour'),
          stir('Beat vigorously into a smooth dough.', 4),
          add('Beat in the egg.', 'egg'),
          add('Pour oil into the pot for frying.', 'oil'),
          heat('Heat the oil to frying temperature.'),
          flip('Fry the churros, turning them to brown evenly.'),
          add('Mix the sugar into a shallow dish.', 'sugar'),
          sprinkle('Roll in cinnamon sugar while hot.', 'cinnamon', 5)
        ])
    ]
  },
  {
    id: 'japanese', name: 'Japanese', title: 'Umami Garden', color: '#1d4ed8', accent: '#fecaca', motif: 'sunrise',
    blurb: 'Simple, balanced and beautiful. Japanese cooking celebrates fresh ingredients and delicate umami flavours.',
    dishes: [
      R('sushi', 'Salmon Sushi Rolls', 60, 'Hard', 'bowl', ['#fffaf0', '#f58f6b', '#27402f'],
        'rice:2 cups sushi rice|nori:4 sheets|salmon:200 g fresh|cucumber:1|avocado:1|vinegar:3 tbsp|soy:for dipping', [
          add('Season warm rice with rice vinegar.', 'rice,vinegar'),
          stir('Fold the rice gently to cool it.', 3),
          chop('Slice the salmon into strips.', 'salmon', 5),
          chop('Slice the cucumber into sticks.', 'cucumber', 5),
          add('Lay the rice on nori and add the fillings.', 'nori,salmon,cucumber,avocado'),
          knead('Roll the sushi tightly with a bamboo mat.', 8),
          sprinkle('Serve with a little soy sauce.', 'soy', 4)
        ]),
      R('ramen', 'Miso Ramen', 45, 'Medium', 'pot', ['#e4b25d', '#f3e9c9', '#4caf50'],
        'noodles:200 g|stock:4 cups|miso:3 tbsp|pork:150 g sliced|egg:2|scallion:2 stalks|nori:2 sheets', [
          simmer('Simmer the egg for a perfect jammy centre.', 7),
          chop('Slice the scallions.', 'scallion', 4),
          add('Bring the stock to heat and stir in the miso.', 'stock,miso'),
          stir('Stir until the miso dissolves.', 3),
          simmer('Boil the noodles until tender.', 7),
          add('Add the noodles and pork.', 'noodles,pork'),
          add('Top with the egg and nori.', 'egg,nori'),
          sprinkle('Add scallions to finish.', 'scallion', 4)
        ]),
      R('tempura', 'Shrimp Tempura', 35, 'Medium', 'pot', ['#e8b862', '#f79c7a', '#f3e9c9'],
        'shrimp:8 large|flour:1 cup|egg:1|water:1 cup ice cold|oil:for frying|soy:for dipping', [
          add('Make the batter with flour, egg and ice water.', 'flour,egg,water'),
          stir('Stir only a few times. Lumps keep the batter light and crisp.', 2),
          heat('Heat the oil until it is shimmering.'),
          add('Dip the shrimp in the batter.', 'shrimp'),
          add('Lower into the hot oil.', 'oil'),
          flip('Flip them once so they turn golden.'),
          sprinkle('Serve with soy dipping sauce.', 'soy', 4)
        ]),
      R('okonomiyaki', 'Okonomiyaki', 30, 'Easy', 'pan', ['#c68b3e', '#7ac74f', '#fffbe0'],
        'cabbage:3 cups shredded|flour:1 cup|egg:2|bacon:100 g|scallion:3 stalks|mayo:for topping', [
          chop('Shred the cabbage finely.', 'cabbage', 5),
          add('Combine cabbage, flour, egg and scallion in a batter.', 'cabbage,flour,egg,scallion'),
          stir('Stir to a thick batter.', 3),
          heat('Heat a pan or griddle.'),
          add('Pour in the batter and lay the bacon on top.', 'bacon'),
          flip('Flip carefully to cook the other side.'),
          sprinkle('Drizzle with mayo.', 'mayo', 5)
        ]),
      R('onigiri', 'Salmon Onigiri', 25, 'Easy', 'bowl', ['#fffaf0', '#27402f', '#f58f6b'],
        'rice:2 cups warm|nori:3 sheets|salmon:100 g cooked|salt:a pinch|sesame:1 tsp', [
          add('Add warm rice to the bowl.', 'rice'),
          sprinkle('Wet your hands and rub them with salt.', 'salt', 3),
          add('Make a salmon filling.', 'salmon'),
          knead('Shape the rice into triangles with a gentle press.', 8),
          add('Wrap with a strip of nori.', 'nori'),
          sprinkle('Sprinkle sesame seeds on top.', 'sesame', 4)
        ])
    ]
  },
  {
    id: 'french', name: 'French', title: 'Cuisine Classique', color: '#7c3aed', accent: '#fde68a', motif: 'fleur',
    blurb: 'Technique is everything: gentle butter, slow onions and delicate sauces. Master these and you can cook almost anything.',
    dishes: [
      R('crepes', 'Sweet Crêpes', 30, 'Easy', 'pan', ['#f0c776', '#e53550', '#fff6dc'],
        'flour:1 cup|egg:2|milk:1¼ cups|butter:2 tbsp melted|sugar:1 tbsp|strawberry:1 cup', [
          add('Add the flour, eggs and sugar.', 'flour,egg,sugar'),
          add('Pour in the milk and melted butter.', 'milk,butter'),
          stir('Whisk until the batter is lump-free.', 3),
          heat('Heat a lightly buttered pan.'),
          flip('Swirl the batter thin, then flip the crêpe.'),
          chop('Slice the strawberries.', 'strawberry', 4),
          add('Fill with strawberries.', 'strawberry')
        ]),
      R('ratatouille', 'Ratatouille', 60, 'Medium', 'pot', ['#6b3a8f', '#e5483b', '#4f9a3c'],
        'eggplant:1|zucchini:2|tomato:4|bellpepper:1|onion:1|garlic:3 cloves|oil:3 tbsp|thyme:a few sprigs', [
          chop('Cut the eggplant into cubes.', 'eggplant', 4),
          chop('Slice the zucchini.', 'zucchini', 5),
          chop('Slice the tomatoes.', 'tomato', 4),
          heat('Warm the olive oil in a pot.'),
          add('Cook the onion, garlic and bell pepper.', 'oil,onion,garlic,bellpepper'),
          add('Add the eggplant, zucchini and tomato.', 'eggplant,zucchini,tomato'),
          sprinkle('Add fresh thyme.', 'thyme', 4),
          simmer('Simmer slowly so the flavours meld.', 9)
        ]),
      R('onion-soup', 'French Onion Soup', 75, 'Medium', 'pot', ['#a8631e', '#f2d27a', '#d8a65b'],
        'onion:5 large|butter:3 tbsp|stock:5 cups|bread:4 slices|cheese:1½ cups gruyère|thyme:a few sprigs', [
          chop('Slice the onions thinly.', 'onion', 6),
          add('Melt the butter and add the onions.', 'butter,onion'),
          heat('Cook slowly until the onions turn deep brown.'),
          stir('Stir often so they do not burn.', 4),
          add('Add the stock and thyme.', 'stock,thyme'),
          simmer('Simmer to combine the flavours.', 8),
          add('Top with toasted bread and cheese.', 'bread,cheese'),
          heat('Grill until the cheese is bubbly.')
        ]),
      R('omelette', 'Classic Omelette', 10, 'Easy', 'pan', ['#f5c842', '#fffbe0', '#6aa84f'],
        'egg:3|butter:1 tbsp|cheese:¼ cup|scallion:1 stalk|salt:a pinch|pepper:a pinch', [
          add('Crack the eggs into the bowl.', 'egg'),
          sprinkle('Season with salt.', 'salt', 3),
          stir('Whisk the eggs until uniform.', 3),
          heat('Melt the butter in a pan over medium heat.'),
          add('Pour in the eggs and add the cheese and scallion.', 'butter,cheese,scallion'),
          flip('Fold the omelette in half with a flip.'),
          sprinkle('Finish with pepper.', 'pepper', 3)
        ]),
      R('creme-brulee', 'Crème Brûlée', 70, 'Hard', 'bowl', ['#f6e2a3', '#d9923a', '#fff6dc'],
        'cream:2 cups|egg:5 yolks|sugar:½ cup|vanilla:1 pod', [
          add('Warm the cream with the vanilla.', 'cream,vanilla'),
          stir('Whisk the egg yolks with half the sugar.', 4),
          add('Slowly pour the cream into the yolks.', 'egg'),
          stir('Stir gently to avoid bubbles.', 3),
          heat('Bake in a water bath until just set. Gentle heat is key.'),
          sprinkle('Spread an even layer of sugar on top.', 'sugar', 6),
          heat('Torch the sugar until it caramelises into a crisp shell.')
        ])
    ]
  }
];
