'use strict';
const fs=require('fs'),path=require('path'),file=path.join(__dirname,'source-recipes.json'),data=JSON.parse(fs.readFileSync(file,'utf8'));
const overrides={
'https://www.cookingformybaby.com/compote-fraise-pomme-poivron-rouge-pour-bebe/':{
 titleKo:'딸기·사과·파프리카 퓨레 (6개월부터)',
 ingredientsKo:['빨간 파프리카 50g','사과 55g (골든 품종, 약 1/4개)','딸기 80g'],
 instructionsKo:['사과를 씻고 약 1/4개를 껍질 벗깁니다. 껍질을 벗긴 사과가 약 55g 되도록 준비한 뒤 작은 깍둑 모양으로 썰어 찜기에 넣습니다.','파프리카를 씻어 씨가 없는 아랫부분을 잘라냅니다. 껍질과 흰 막을 제거해 손질한 파프리카 50g을 준비합니다. 파프리카 껍질은 아기가 소화하기 어려울 수 있어 벗깁니다.','사과와 파프리카를 찜기에 넣고 6분간 찝니다.','그동안 딸기를 씻고 꼭지를 제거합니다.','6분이 지나면 사과와 파프리카를 꺼내지 않은 채 딸기를 찜기에 더해 2분간 더 찝니다.','재료를 모두 곱게 갈아 퓨레로 만듭니다.','아기에게 간식으로 주기 전에 퓨레를 식힙니다.']
},
'https://www.cookingformybaby.com/puree-bebe-chou-fleur-pomme-de-terre-6-mois/':{
 titleKo:'콜리플라워·감자 퓨레',
 ingredientsKo:['손질한 콜리플라워 꽃송이 300g','작은 감자 2개','유채씨유 2작은술'],
 instructionsKo:['감자를 씻어 껍질을 벗기고 아주 얇게 썰어 찜기에 넣습니다.','콜리플라워를 씻어 작은 꽃송이로 나눠 약 300g 준비합니다. 감자 위에 올립니다.','찜기에서 약 10분간 익힙니다. 압력 조리기를 사용하면 기기 안내에 따라 약 5분간 조리합니다.','익힌 채소를 유채씨유와 함께 믹서기에 넣고 곱게 갈아 퓨레로 만듭니다. 콜리플라워에 수분이 많으므로 조리용 물은 먼저 넣지 말고, 필요한 경우에만 농도를 조절합니다.','아기에게 알맞은 농도로 맞춰 식혀서 냅니다.']
},
'https://www.cookingformybaby.com/brunoise-de-mangue-marinade-de-grenade-sur-fromage-blanc-vanille-des-8-mois-pour-bebe/':{
 titleKo:'망고·석류와 바닐라 요거트',
 ingredientsKo:['석류 1개','망고 1개','플레인 요거트(원문: 프랑스식 생치즈) 90g','바닐라빈 1개'],
 instructionsKo:['석류를 반으로 자릅니다. 반쪽에서 즙을 짜고, 씨나 과육 조각이 섞였다면 고운 체에 거릅니다. 원문에서는 석류즙 약 30ml를 사용합니다.','망고를 반으로 잘라 껍질을 벗깁니다. 망고 과육 약 120g을 준비합니다.','아기가 12개월 미만이면 망고를 잘게 썰어 석류즙과 함께 곱게 갈아 줍니다. 12개월 이상이고 씹는 식감에 익숙하다면 4mm 정도로 잘게 썰 수 있습니다.','잘게 썬 망고에 석류즙을 붓고 냉장고에서 재웁니다. 12개월 미만은 이 단계에서 망고와 석류즙을 함께 갈아 주세요.','바닐라빈을 세로로 갈라 씨를 긁어냅니다. 바닐라 씨를 플레인 요거트에 넣고 고루 섞습니다.','그릇 바닥에 바닐라 요거트를 담고 망고와 석류즙을 얹습니다. 냉장고에서 약 2시간 두었다가 냅니다.']
},
'https://www.cookingformybaby.com/quesadillas-pour-bebe/':{
 titleKo:'아기용 채소·콩 퀘사디야',
 ingredientsKo:['작은 옥수수 토르티야 4장(또는 밀 토르티야)','작은 캔 강낭콩 1개','작은 캔 옥수수 1개','아보카도 1개','체더 치즈(또는 원하는 치즈)','파슬리나 고수 약간(선택)','버터 약간'],
 instructionsKo:['강낭콩과 옥수수는 물기를 빼고, 아기가 씹기 편한 정도로 으깨 준비합니다. 아보카도와 치즈를 곁들여 속재료로 사용합니다. 원문에는 속재료의 정확한 분량과 섞는 순서가 자세히 적혀 있지 않습니다.','팬을 중불로 달군 뒤 버터를 조금 녹입니다. 토르티야에 속재료를 올리고 반으로 접어 팬에 놓습니다.','양면이 살짝 노릇해지도록 한 면당 1~2분씩 굽습니다. 나머지 토르티야도 같은 방법으로 굽습니다.','먹기 좋은 크기로 잘라 냅니다. 아기가 콩과 옥수수 알갱이를 안전하게 먹을 수 있도록 잘게 으깨고, 먹는 동안 곁에서 지켜봅니다.']
},
'https://www.cookingformybaby.com/recette-gnocchis-patate-douce-bebe/':{
 titleKo:'고구마·모짜렐라치즈·바질 뇨키',
 ingredientsKo:['고구마 200g','옥수수전분 20g','밀가루 40g(성형용 약간 추가)','바질잎 3장','조리용 모짜렐라치즈 35g'],
 instructionsKo:['고구마를 씻어 껍질을 벗기고 얇게 썹니다. 찜기에서 약 10분간 완전히 부드러워질 때까지 찝니다.','익힌 고구마를 볼에 담고 덩어리가 남지 않도록 포크로 으깬 뒤 10~15분 식힙니다.','옥수수전분과 밀가루를 넣습니다. 씻어 잘게 썬 바질과 모짜렐라치즈도 넣고 고루 섞어 반죽합니다. 반죽이 너무 달라붙으면 성형할 때 밀가루를 조금 더 묻힙니다.','도마에 밀가루를 살짝 뿌리고 반죽을 두 가닥으로 길게 굴립니다. 칼로 작게 잘라 뇨키 모양을 만들고, 원하면 포크로 무늬를 냅니다.','끓는 물에 뇨키를 넣습니다. 떠오르면 익은 것이므로 약 2분 후 건져 물기를 뺍니다.','여기서 바로 내거나, 달군 팬에 기름을 조금 두르고 중불에서 앞뒤로 1~2분씩 노릇하게 굽습니다.']
},
'https://www.cookingformybaby.com/recette-de-tortilla-de-legumes-pour-bebe/':{
 titleKo:'아기용 채소 토르티야(스페인식 달걀부침)',
 ingredientsKo:['당근 30g','감자 30g','애호박 30g','양파 15g','달걀 1개','그뤼에르 치즈 약간(선택)','올리브유 또는 해바라기유 약간'],
 instructionsKo:['당근, 애호박, 감자를 씻고 껍질을 벗긴 뒤 작은 깍둑 모양으로 썹니다.','양파 15g도 잘게 썹니다.','채소를 찜기에서 약 6분간 부드럽게 익힙니다.','그릇에 달걀을 풀고, 사용할 경우 강판에 간 치즈를 넣습니다.','작은 팬에 기름을 조금 두르고 익힌 채소를 넣습니다. 달걀물을 고루 붓습니다.','중불에서 한쪽 면을 약 4분 익힙니다. 접시를 덮고 팬을 뒤집어 토르티야를 접시에 옮긴 다음, 다시 팬으로 밀어 넣어 반대쪽도 약불~중불에서 4분 익힙니다.','속까지 완전히 익고 겉면이 살짝 노릇해지면 접시에 옮겨 잠시 식힙니다. 아기에게 월령과 씹는 능력에 맞춰 작게 나누어 냅니다.','원문 안내량은 12개월 무렵에는 반 개, 18개월부터는 한 개입니다. 아기가 덩어리를 먹는 능력에 맞춰 조절합니다.']
}
};
for(const r of data.recipes){const o=overrides[r.url];if(o){r.titleKo=o.titleKo;r.ingredientsKo=o.ingredientsKo;r.instructionsKo=o.instructionsKo;r.translationReview='manual Korean review based on the source page';if(r.url.includes('quesadillas-pour-bebe'))r.translationNoteKo='원문에는 속재료를 토르티야에 어떻게 넣는지와 정확한 양이 충분히 설명되어 있지 않아, 앱 안내에 그 점을 표시합니다.';}}
const carrotSweetPotato=data.recipes.find(r=>r.url==='https://www.cookingformybaby.com/recette-puree-bebe-carottes-patate-douce-4-mois/');
if(carrotSweetPotato){carrotSweetPotato.instructionGroupsKo=[{title:'당근',steps:['깨끗이 씻고 꼭지와 껍질을 제거한 뒤 얇게 썹니다.']},{title:'고구마',steps:['깨끗이 씻고 껍질을 벗깁니다. 단단한 돌기 부분을 제거한 뒤 얇게 썹니다.']},{title:'함께 찌기',steps:['당근과 고구마를 찜기에 넣고 16분간 부드럽게 찝니다.']},{title:'곱게 갈기',steps:['익힌 재료를 믹서기에 옮깁니다. 조리수를 조금씩 넣어 아기에게 알맞은 부드러운 농도로 갑니다.']}];carrotSweetPotato.translationReview='manual Korean review; ingredient-by-ingredient cooking format';}
fs.writeFileSync(file,JSON.stringify(data,null,2),'utf8');
console.log(`수동 번역 검토 ${Object.keys(overrides).length}개`);

