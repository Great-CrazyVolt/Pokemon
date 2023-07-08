let authorLinks = document.querySelectorAll("img")

for (authorLink of authorLinks) {
  authorLink.addEventListener("click", getMonsterInfo)
}

async function getMonsterInfo() {

  $('#authorModal').modal('show')
  let url = `/api/monster/${this.id}`

  let response = await fetch(url)
  let data = await response.json()

  let monsterInfo = document.querySelector('#monsterInfo')
  monsterInfo.innerHTML = `<h5> ${data[0].monsterId}
                                ${data[0].name} </h5>
                            <p> moveSet: ${data[0].moveSet} </p>
                            <p> firstCaught: ${data[0].firstCaught} </p>
                            <p> description: ${data[0].description} </p>
                            <img src=/img/${data[0].imgName}  />   
                            <p> score ${data[0].score} </p>
                            <p> elementId: ${data[0].elementId} </p>`
}