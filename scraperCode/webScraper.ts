import { Browser } from "puppeteer"

const puppeteer = require("puppeteer")
const fs = require("fs")
const path = require("path")

const scrapeProbs = async (url: string) => {
    try {
      const browser: Browser = await puppeteer.launch({ headless: false })
      const page = await browser.newPage()
      await page.goto(url)
  
      const probData = await page.evaluate(() => {
        const tdElements = Array.from(document.querySelectorAll("tr"))
        const filteredData = tdElements
          .map((tdata: any) => ({
            probName: tdata.querySelector("td:nth-child(2)")?.textContent,
            lcLink: tdata
              .querySelector("td[title='Leetcode link'] a")
              ?.getAttribute("href")
          }))
          .filter((item) => item.probName && item.lcLink && item.lcLink.includes('https://leetcode.com/problems/'))
  
        const data = filteredData.map((item, index) => ({
          idNo: index + 1,
          probName: item.probName,
          lcLink: item.lcLink
        }))
        data.forEach((item) => {
          console.log(
            "idNo:",
            item.idNo,
            "probName:",
            item.probName,
            "lcLink:",
            item.lcLink
          )
        })
        return data
      })
      await browser.close()
      return probData
    } catch (error) {
      return undefined
    }
  }
  

// ------------------------------------------------------------

const scrapeStriver191Probs = async (url: string) => {
  return await scrapeProbs(url)
}
const scrapeStriverDSAbegineer = async (url: string) => {
  const data = await scrapeProbs(url)
  return data
}

const scrapeStriverExpertProbs = async (url: string) => {
  return await scrapeProbs(url)
}
// -----------------------------------------------------------------

const saveProblemstoJSON = (
  filename: string,
  dirLocation: string,
  data: object[]
) => {
  const filePath = `${dirLocation}/${filename}`
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err: any) => {})
}
// ------------------------------------------------------------

module.exports = {
  scrapeStriver191Probs,
  scrapeStriverDSAbegineer,
  scrapeStriverExpertProbs,
  saveProblemstoJSON
}
