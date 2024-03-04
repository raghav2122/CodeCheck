import * as probs from "leetcode-problems/striver191Probs.json"
import * as probsBase from "leetcode-problems/striverDSAbegineer.json"

import { storage } from "./storage"

let webRequestListenerAdded = false
const Rule_ID = 1
let currIndex = 0
let probSolved = 0
let matchingUrl = ""
let false_status_count = 0

chrome.tabs.onCreated.addListener(async function (tab) {
  console.log("Tab created:", tab)
  await setStatusFalse()
  if (probSolved < 2) {
    console.log("Checking status for problem:", probs[currIndex].lcLink)
    addWebRequestListener()
    matchingUrl = ""
    let url = probs[currIndex].lcLink
    let problemStatus = await checkStatus(url)
    console.log("Problem status", problemStatus)
    while (currIndex < probs.length && problemStatus === true) {
      currIndex++
      url = probs[currIndex].lcLink
      problemStatus = await checkStatus(url)
      console.log("Problem status", problemStatus)
    }
    if (currIndex < probs.length && probSolved < 2) {
      getProblemLinkAtIndex(probs, currIndex).then((redirectUrl) => {
        console.log("Redirecting to:", redirectUrl)
        setRedirectRuleForTab(redirectUrl)
      })
    }
  }
})

function webRequestListener(details) {
  if (matchingUrl === "" && isLeetCodeSubmissionUrl(details.url)) {
    const lcLink = probs[currIndex].lcLink
    checkStatus(lcLink).then((problemStatus) => {
      if (problemStatus === false) {
        console.log("URL is a LeetCode submission URL")
        matchingUrl = details.url
        setTimeout(() => {
          fetchAndCheckObjects(matchingUrl).then((isAccepted) => {
            if (isAccepted) {
              probSolved++
              chrome.webRequest.onCompleted.removeListener(webRequestListener)
              webRequestListenerAdded = false
              matchingUrl = ""
              console.log("Accepted submission, moving to next problem")
              updateStatusTrue(lcLink)
                .then(() => {
                  console.log("Problem state saved successfully")
                  currIndex++
                })
                .catch((error) => {
                  console.error("Error saving problem state:", error)
                })
              if (probSolved === 2) {
                chrome.declarativeNetRequest.updateDynamicRules({
                  removeRuleIds: [Rule_ID]
                })
              }
            }
          })
        }, 2000) // Delay fetchAndCheckObjects by 1500 ms (1.5 seconds)
      } else {
        console.log("Problem already solved, ignoring URL")
      }
    })
  } else if (matchingUrl !== "" && details.url !== matchingUrl) {
    // Perform actions for other URLs
  }
}

function addWebRequestListener() {
  if (!webRequestListenerAdded) {
    chrome.webRequest.onCompleted.addListener(
      webRequestListener,
      { urls: ["<all_urls>"] },
      ["responseHeaders"]
    )
    webRequestListenerAdded = true
  }
}

// Add the initial listener
addWebRequestListener()

async function setStatusFalse() {
  try {
    const batchSize = 10 // Set the batch size to 10
    const endIndex = Math.min(false_status_count + batchSize, probsBase.length)

    for (let i = false_status_count; i < endIndex; i++) {
      await storage.set(probsBase[i].lcLink, false)
    }

    console.log(
      `Status set to false for ${false_status_count} item ${false_status_count} to ${endIndex - 1} in local storage.`
    )

    // Move the current index by 10 for the next batch
    false_status_count += batchSize
    if (false_status_count >= probsBase.length) {
      // Reset the current index if we've reached the end of the array
      false_status_count = 0
    }
  } catch (err) {
    console.error("Error setting status:", err)
  }
}

async function checkStatus(lcLink) {
  try {
    const status = await storage.get(lcLink)
    console.log(`Status for ${lcLink} is ${status}`)
    return typeof status === "string" && status === "true"
  } catch (err) {
    console.error("Error checking status:", err)
    return false
  }
}

async function updateStatusTrue(lcLink) {
  try {
    // Set the status to true in local storage
    await storage.set(lcLink, true)

    console.log(`Status updated to true for ${lcLink}`)
  } catch (err) {
    console.error("Error updating status:", err)
  }
}

async function fetchAndCheckObjects(checkUrl) {
  try {
    const response = await fetch(checkUrl)
    const data = await response.json()
    return data.status_msg === "Accepted"
  } catch (error) {
    console.error("Error fetching or parsing data:", error)
    return false
  }
}

function isLeetCodeSubmissionUrl(url) {
  const regex = /^https:\/\/leetcode\.com\/submissions\/detail\/\d+\/check\/$/
  return regex.test(url)
}

async function getProblemLinkAtIndex(probs, currIndex) {
  try {
    if (currIndex >= probs.length || currIndex < 0) {
      throw new Error(`Index ${currIndex} is out of bounds`)
    }

    return probs[currIndex].lcLink
  } catch (error) {
    console.error("Error getting problem link:", error)
    return ""
  }
}

function setRedirectRuleForTab(redirectUrl) {
  const redirectRule = {
    id: Rule_ID,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { url: redirectUrl }
    },
    condition: {
      urlFilter: "*://*/*",
      excludedInitiatorDomains: ["developer.chrome.com"],
      resourceTypes: ["main_frame"]
    }
  }

  try {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [Rule_ID],
      addRules: [redirectRule as chrome.declarativeNetRequest.Rule]
    })

    console.log("Redirect rule updated for tab:")
  } catch (error) {
    console.error("Error updating redirect rule for tab:", error)
  }
}
