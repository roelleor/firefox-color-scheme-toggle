const AUTO_SCHEME = 'auto';

async function getCurrentScheme() {
  const result = await browser.browserSettings.overrideContentColorScheme.get({});
  return result.value || AUTO_SCHEME;
}

async function setScheme(value) {
  await browser.browserSettings.overrideContentColorScheme.set({ value });
  await updateButtonTitle();
}

function isAutoScheme(value) {
  return value === AUTO_SCHEME || value === 'browser' || value === 'system';
}

function getModeLabel(value) {
  return isAutoScheme(value) ? 'auto' : 'auto flipped';
}

function getFlippedScheme() {
  // Firefox doesn't expose a native "auto flipped" mode, so we force the
  // opposite of the browser's current preferred scheme.
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
}

async function updateButtonTitle() {
  const current = await getCurrentScheme();
  const currentLabel = getModeLabel(current);
  const nextLabel = currentLabel === 'auto' ? 'auto flipped' : 'auto';

  await browser.browserAction.setTitle({
    title: `Website appearance: ${currentLabel}. Click to switch to ${nextLabel}.`
  });

  await browser.browserAction.setBadgeText({
    text: 'A'
  });
}

async function toggleScheme() {
  const current = await getCurrentScheme();
  const next = isAutoScheme(current) ? getFlippedScheme() : AUTO_SCHEME;
  await setScheme(next);
}

browser.browserAction.onClicked.addListener(() => {
  toggleScheme().catch(console.error);
});

browser.browserSettings.overrideContentColorScheme.onChange.addListener(() => {
  updateButtonTitle().catch(console.error);
});

browser.runtime.onInstalled.addListener(() => {
  updateButtonTitle().catch(console.error);
});

browser.runtime.onStartup.addListener(() => {
  updateButtonTitle().catch(console.error);
});
