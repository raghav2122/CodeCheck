const {
  scrapeStriver191Probs,
  scrapeStriverDSAbegineer,
  scrapeStriverExpertProbs,
  saveProblemstoJSON
} = require("./webScraper")

;(async () => {
  const saveDirectoryLocation = ".leetcode-problems"

  const striverDSAbegineer = await scrapeStriverDSAbegineer(
    "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/"
  )
  saveProblemstoJSON(
    "striverDSAbegineer.json",
    saveDirectoryLocation,
    striverDSAbegineer
  )

  const striver191Probs = await scrapeStriver191Probs(
    "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/"
  )
  saveProblemstoJSON(
    "striver191Probs.json",
    saveDirectoryLocation,
    striver191Probs
  )

  const striverExpertProbs = await scrapeStriverExpertProbs(
    "https://takeuforward.org/interview-sheets/strivers-79-last-moment-dsa-sheet-ace-interviews/"
  )
  saveProblemstoJSON(
    "striverExpertProbs.json",
    saveDirectoryLocation,
    striverExpertProbs
  )
})()
