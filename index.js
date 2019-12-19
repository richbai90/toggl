const Toggl = require("toggl-api");
const toggl = new Toggl({ apiToken: "192a8b1e52fd62d7de85b692c4f4b84f" });

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time * 1000);
  });
}

async function* createTimeEntryGenerator(month) {
  let today = new Date();
  if (month) {
    today = new Date(today.getFullYear(), month);
  }
  const days = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

  for (let i = 1; i < days; i++) {
    const r = await createTimeEntry(i, today);
    yield(r);
  }
}

function createTimeEntry(day, today) {
    return new Promise((resolve, reject) => {
        toggl.createTimeEntry(
            {
              description: "Daily Standup",
              pid: 87306022,
              start: new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                day,
                8,
                30,
                0,
                0
              ).toISOString(),
              end: new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                day,
                9,
                0,
                0
              ).toISOString(),
              created_with: "node",
              duration: 30 * 60,
            },
            async response => {
              await sleep(5);
              console.log(response);
              resolve(response);
            }
          );
    })
}

async function createTimeEntries() {
    let entries = createTimeEntryGenerator(11);
    let entry = await entries.next();
    while (!entry.done) {
      console.log(entry.value);
      entry = await entries.next();
    }
}

createTimeEntries();
