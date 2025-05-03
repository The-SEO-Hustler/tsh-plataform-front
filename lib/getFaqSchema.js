// /lib/wordpress/utils.js
const cheerio = require('cheerio')

/**
 * Scans a rendered HTML string for a <div id="faq-tsh">…</div> block
 * and, if found, returns an object ready for JSON-LD injection.
 * Otherwise returns null.
 *
 * @param {string} htmlString – the rendered post.content HTML
 * @returns {object|null} – the FAQPage schema object, or null if no FAQ block
 */
export function getFaqSchema(htmlString) {
  const $ = cheerio.load(htmlString)
  const wrapper = $('#faq-tsh')
  if (!wrapper.length) return null

  const mainEntity = []

  wrapper.find('.faq-item').each((_, el) => {
    const $el = $(el)
    const question = $el.find('.faq-q').text().trim()
    // grab inner HTML of the answer container
    const answerHtml = $el.find('.faq-a').html().trim()

    if (question) {
      mainEntity.push({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answerHtml
        }
      })
    }
  })

  if (!mainEntity.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity
  }
}
