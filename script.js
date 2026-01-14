console.log("JS RUNNING");

// force clean state
//localStorage.clear();

let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Safety: ensure completedDates always exists
habits.forEach(habit => {
    if (!habit.completedDates) {
        habit.completedDates = [];
    }
});
function saveData() {
    localStorage.setItem("habits", JSON.stringify(habits));
}


document.getElementById("addBtn").addEventListener("click", addHabit);

function addHabit() {
    let input = document.getElementById("habitInput");
    let name = input.value.trim();

    if (name === "") {
        alert("Enter habit");
        return;
    }

   habits.push({
    name: name,
    completedDates: []
});

input.value = "";
saveData();
renderHabits();
renderMonthlyProgress();

}

function renderHabits() {
    let list = document.getElementById("habitList");
    list.innerHTML = "";

    habits.forEach((habit, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${habit.name}
            <button onclick="markDone(${index})">Done</button>
        `;
        list.appendChild(li);
    });
}

function markDone(index) {
    let today = new Date().toISOString().split("T")[0];

    if (!habits[index].completedDates.includes(today)) {
    habits[index].completedDates.push(today);
    saveData();
}

renderMonthlyProgress();

}
function renderMonthlyProgress() {
    let box = document.getElementById("monthlyProgress");
    box.innerHTML = "";

    let now = new Date();
    let month = now.getMonth();
    let year = now.getFullYear();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    habits.forEach(habit => {
        let count = habit.completedDates.filter(d => {
            let date = new Date(d);
            return date.getMonth() === month && date.getFullYear() === year;
        }).length;

        let percent = Math.round((count / daysInMonth) * 100);

        let div = document.createElement("div");
        div.innerHTML = `
            <strong>${habit.name}</strong>
            <div style="background:#ddd;height:10px;width:200px;margin:5px auto">
                <div style="background:#2c7be5;height:10px;width:${percent}%"></div>
            </div>
            ${percent}%
        `;

        box.appendChild(div);
    });
}
renderHabits();
renderMonthlyProgress();

