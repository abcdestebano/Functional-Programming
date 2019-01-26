const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

/**
 *
 *
 * @param {*} [obj={}]
 * @returns
 */
const attrsToString = (obj = {}) =>
  Object.keys(obj)
    .map(attr => ` ${attr}="${obj[attr]}"`)
    .join('')

/**
 *
 *
 * @param {*} obj
 */
const tagAttrs = obj => (content = "") =>
  `<${obj.tag}${obj.attrs ? '' : ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

/**
 *
 *
 * @param {*} t
 */
const tag = t => typeof t === 'string' ? tagAttrs({ tag: t }) : tagAttrs(t)


const tableRowTag = tag('tr')
const tableRow = items => compose(tableRowTag, tableCells)(items);
// const tableRow = items => tableRowTag(tableCells(items));
const tableCell = tag('td')
const tableCells = item => item.map(tableCell).join('')

const trashIcon = tag({ tag: 'i', attrs: { class: 'fas fa-trash-alt' } })('')

// VARIABLES

const description = $('#description')
const carbs = $('#carbs')
const calories = $('#calories')
const protein = $('#protein')
const list = [];

description.keypress(() => description.removeClass('is-invalid'))
carbs.keypress(() => carbs.removeClass('is-invalid'))
calories.keypress(() => calories.removeClass('is-invalid'))
protein.keypress(() => protein.removeClass('is-invalid'))


/**
 *
 *
 */
const validateInputs = () => {
  !description.val() ? description.addClass('is-invalid') : '';
  !carbs.val() ? carbs.addClass('is-invalid') : '';
  !calories.val() ? calories.addClass('is-invalid') : '';
  !protein.val() ? protein.addClass('is-invalid') : '';
  if (description.val() && carbs.val() && calories.val() && protein.val()) {
    addToList(description.val(), parseInt(carbs.val()), parseInt(calories.val()), parseInt(protein.val()))
  }
}

/**
 *
 *
 * @param {*} description
 * @param {*} carbs
 * @param {*} calories
 * @param {*} protein
 */
const addToList = (description, carbs, calories, protein) => {
  const newItem = { description, carbs, calories, protein };
  list.push(newItem)
  clearInputs()
  updateTotals()
  renderItems()
}

/**
 *
 *
 */
const updateTotals = () => {
  let calories = 0, carbs = 0, protein = 0
  list.map(item => {
    calories += item.calories
    carbs += item.carbs
    protein += item.protein
  })
  $('#totalCalories').text(calories)
  $('#totalCarbs').text(carbs)
  $('#totalProtein').text(protein)
}

/**
 *
 *
 */
const clearInputs = () => {
  description.val('');
  carbs.val('');
  calories.val('');
  protein.val('');
}

/**
 *
 *
 */
const renderItems = () => {
  $('tbody').empty();
  list.map((item, index) => {
    const buttonRemove = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItem(${index})`
      }
    })(trashIcon)
    $('tbody').append(tableRow([item.description, item.calories, item.carbs, item.protein, buttonRemove]))
  })
}

/**
 *
 *
 * @param {*} index
 */
const removeItem = (index) => {
  list.splice(index, 1)
  updateTotals()
  renderItems()
}
