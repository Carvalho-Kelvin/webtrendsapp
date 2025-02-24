import { db, auth } from "./firebase.js";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', async function() {
  // Wait for authentication state to be determined
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User is authenticated:", user.uid);
      // Now that the user is authenticated, load the habits.
      loadHabits();

      // Attach event listener for the "Add Habit" form
      const addHabitForm = document.getElementById('addHabitForm');
      const habitsList = document.getElementById('habits');
      const completedList = document.getElementById('completedHabits');

      if (!addHabitForm || !habitsList || !completedList) {
        console.error("Some elements are missing in the DOM.");
        return;
      }

      addHabitForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const habitName = document.getElementById('habitName').value.trim();
        const habitGoal = parseInt(document.getElementById('habitGoal').value.trim());
        const habitUnit = document.getElementById('habitUnit').value.trim();

        if (habitName && !isNaN(habitGoal) && habitGoal > 0 && habitUnit) {
          try {
            const docRef = await addDoc(collection(db, "habits"), {
              name: habitName,
              goal: habitGoal,
              unit: habitUnit,
              progress: 0,
              completed: false,
              owner: user.uid
            });
            console.log("Habit added with ID:", docRef.id);
            addHabitForm.reset();
            loadHabits(); // Refresh UI
          } catch (error) {
            console.error("Error adding habit:", error);
          }
        } else {
          alert("Please fill all fields correctly.");
        }
      });
    } else {
      console.error("User not authenticated. Please sign in first.");
      // Optionally, redirect to the sign-in page:
      window.location.href = "index.html";
    }
  });

  // Function to load habits for the current user only
  async function loadHabits() {
    const habitsList = document.getElementById('habits');
    const completedList = document.getElementById('completedHabits');
    habitsList.innerHTML = "";
    completedList.innerHTML = "";

    try {
      const q = query(collection(db, "habits"), where("owner", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        const habit = docSnap.data();
        const habitElement = createHabitElement(docSnap.id, habit);
        if (habit.completed) {
          completedList.appendChild(habitElement);
        } else {
          habitsList.appendChild(habitElement);
        }
      });
    } catch (error) {
      console.error("Error loading habits:", error);
    }
  }

   // Attach logout functionality
   const logoutButton = document.getElementById('logout');
   if (logoutButton) {
     logoutButton.addEventListener('click', async () => {
       try {
         await signOut(auth);
         console.log("User signed out successfully.");
         // Redirect to the login page (adjust the path if necessary)
         window.location.href = "index.html";
       } catch (error) {
         console.error("Error signing out:", error);
       }
     });
   } else {
     console.error("Logout button not found in the DOM.");
   }

  // Function to create a habit element in the list
  function createHabitElement(id, habit) {
    const li = document.createElement("li");
    li.setAttribute("data-id", id);
    li.setAttribute("data-goal", habit.goal);
    li.setAttribute("data-progress", habit.progress);
    li.setAttribute("data-unit", habit.unit);
    
    li.innerHTML = `
      <span class="habit-text">${habit.name}</span>
      <span class="progress">${habit.progress}/${habit.goal} ${habit.unit}</span>
      <button class="decrease-btn">-</button>
      <button class="increase-btn">+</button>
      <button class="complete-btn">Complete</button>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;
    
    if (habit.completed) {
      li.classList.add("completed");
      li.querySelectorAll("button").forEach(btn => btn.style.display = "none");
      const undoButton = document.createElement("button");
      undoButton.className = "undo-btn";
      undoButton.textContent = "Undo";
      undoButton.addEventListener("click", async () => {
        await updateDoc(doc(db, "habits", id), { progress: 0, completed: false });
        loadHabits();
      });
      li.appendChild(undoButton);
    } else {
      li.querySelector(".increase-btn").addEventListener("click", async () => {
        if (habit.progress < habit.goal) {
          habit.progress++;
          await updateDoc(doc(db, "habits", id), { progress: habit.progress });
          if (habit.progress === habit.goal) {
            await updateDoc(doc(db, "habits", id), { completed: true });
          }
          loadHabits();
        }
      });
  
      li.querySelector(".decrease-btn").addEventListener("click", async () => {
        if (habit.progress > 0) {
          habit.progress--;
          await updateDoc(doc(db, "habits", id), { progress: habit.progress });
          loadHabits();
        }
      });
  
      li.querySelector(".complete-btn").addEventListener("click", async () => {
        await updateDoc(doc(db, "habits", id), { completed: true, progress: habit.goal });
        loadHabits();
      });
  
      li.querySelector(".edit-btn").addEventListener("click", async () => {
        const currentName = li.querySelector('.habit-text').textContent;
        const currentGoal = li.getAttribute('data-goal');
        const currentUnit = li.getAttribute('data-unit');
  
        const newName = prompt('Edit habit name:', currentName);
        const newGoalInput = prompt('Edit daily goal:', currentGoal);
        const newUnit = prompt('Edit unit (e.g., pages, kms):', currentUnit);
  
        if (newName && newGoalInput && !isNaN(newGoalInput) && newUnit) {
          const newGoal = parseInt(newGoalInput);
          await updateDoc(doc(db, "habits", id), {
            name: newName.trim(),
            goal: newGoal,
            unit: newUnit.trim(),
            progress: 0,
            completed: false
          });
          loadHabits();
        } else {
          alert("Invalid input. Please try again.");
        }
      });
  
      li.querySelector(".delete-btn").addEventListener("click", async () => {
        await deleteDoc(doc(db, "habits", id));
        loadHabits();
      });
    }
    
    return li;
  }  
});
