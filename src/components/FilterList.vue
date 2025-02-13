<template>
  <div class="filter-wrapper">
    <div>
      <h5>Filters</h5>
      <div class="filter-section">
        <p class="p-0 m-0">Priority</p>
        <div class="priority-wrapper">
          <label class="custom-checkbox" v-for="(item, index) in priorityList" :key="index">
            <input type="checkbox" :value="item.key" v-model="selectedPriorities" />
            <span class="checkmark"></span>
            {{ item.label }}
          </label>
        </div>
      </div>

      <div class="filter-section">
        <p class="">Issue type</p>
        <div class="priority-wrapper">
          <label class="custom-checkbox" v-for="(item, index) in issueTypeList" :key="index">
            <input type="checkbox" :value="item.key" v-model="selectedIssueTypes" />
            <span class="checkmark"></span>
            {{ item.label }}
          </label>
        </div>
      </div>

      <div class="filter-date">
        <div class="filter-title">
          <p class="p-0 m-0">Due date</p>
          <span>
            {{ redableDate }}
          </span>
        </div>

        <div class="date-picker-wrapper">
          <button class="btn-date-picker" @click="setDate('today')">
            Today
          </button>
          <VDatePicker title-position="right" mode="date" v-model="date" show-months ref="calendar" @move="move"
            :select-attribute="{ dot: true }">
            <template #default="{ togglePopover }">
              <button class="btn-date-picker" @click="togglePopover">
                Select date
              </button>
            </template>
          </VDatePicker>
          <button class="btn-date-picker" @click="setDate('tomorrow')">
            Tomorrow
          </button>

        </div>
      </div>

      <div class="filter-section">
        <p class="p-0 m-0">Labels</p>

        <div class="multiselect-container">
          <span v-for="(item, index) in selectedListItems" :key="index" class="selected-item">
            {{ item.label }}
            <button @click="removeItem(index)">X</button>
          </span>
          <div class="dropdown" @click="isOpen = true">
            <input type="text" v-model="search" placeholder="Select options..." />
            <ul class="dropdown-list" v-if="isOpen">
              <li v-for="(option, index) in filteredOptions" :key="index" @click.stop="selectItem(option)"
                :class="{ selected: selectedListItems.includes(option) }">
                {{ option.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="call-to-action">
        <!-- <button class="btn-cancel" @click="closeModal">Close</button> -->
        <button class="btn-apply" @click="applyFilters" >

          <div v-if="loader" class="spinner-border" role="status">
            <span class="sr-only"></span>
          </div>
          <span v-else class="fw-bold">Apply</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
const emit = defineEmits(["save", "onCancle"]);
const loader = ref(false);
const selectedPriorities = ref([]);
const selectedIssueTypes = ref([]);
const selectedListItems = ref([]);
const search = ref("");
const calendar = ref(null);
const isOpen = ref(false);
const filteredOptions = ref([]);
const date = ref(null);
const priorityList = [
  { key: "1", label: "Minimal" },
  { key: "2", label: "Low" },
  { key: "3", label: "Medium" },
  { key: "4", label: "High" },
  { key: "5", label: "Critical" },
];

const issueTypeList = [
  { key: "1", label: "Bug" },
  { key: "2", label: "Epic" },
  { key: "3", label: "Story" },
  { key: "4", label: "Sub task" },
  { key: "5", label: "Task" },
];
const lableList = [
  { key: 1, label: "Angular learning" },
  { key: 2, label: "Vue learning" },
  { key: 3, label: "React learning" },
  { key: 4, label: "DevOps learning" },
  { key: 5, label: "ImagePorcessing" },
  { key: 6, label: "Computer Vission" },
  { key: 7, label: "PHP" },
  { key: 8, label: "Node" },
  { key: 9, label: "Web3" },
  { key: 10, label: "AL / ML" },
];

watch([search], ([newPriorities]) => {
  const searchTearm = newPriorities.toLowerCase();
  filteredOptions.value = lableList
    .filter(({ label }) => label.toLowerCase().includes(searchTearm))
    .splice(0, 5);
});
const closeModal = () => {
  // localStorage.setItem(
  //   "setFilters",
  //   JSON.stringify({
  //     priorities: [],
  //     issueTypes: [],
  //     labels: [],
  //     date: null,
  //   })
  // );
  emit("onCancle");
};
const applyFilters = () => {
  loader.value = true;
  localStorage.setItem(
    "setFilters",
    JSON.stringify({
      priorities: selectedPriorities.value,
      issueTypes: selectedIssueTypes.value,
      labels: selectedListItems.value,
      date: date.value,
    })
  );
  emit("save", {
    priorities: selectedPriorities.value,
    issueTypes: selectedIssueTypes.value,
    labels: selectedListItems.value,
    date: date.value,
  });
};
const selectItem = (option) => {
  const index = selectedListItems.value.findIndex(
    (item) => item.key === option.key
  );
  if (index === -1) {
    selectedListItems.value.push(option);
  }
  search.value = "";
};
const removeItem = (index) => {
  selectedListItems.value.splice(index, 1);
};
const setDate = (type) => {
  const today = new Date();
  if (type === "today") {
    date.value = today;
  } else if (type === "tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    date.value = tomorrow;
  }
};
const redableDate = computed(() => {
  if (!date.value) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  console.log(date.value);

  const dateObj =
    date.value instanceof Date ? date.value : new Date(date.value);

  return dateObj.toLocaleDateString(undefined, options);
});
async function move() {
  console.log("MOVE");
  await calendar.value.moveBy(1);
  await calendar.value.moveBy(-1);
}
onMounted(() => {
  filteredOptions.value = lableList.splice(0, 5);
  const storedItems = JSON.parse(localStorage.getItem("setFilters"));
  if (storedItems) {
    selectedPriorities.value = storedItems.priorities
      ? storedItems.priorities
      : [];
    selectedIssueTypes.value = storedItems.issueTypes
      ? storedItems.issueTypes
      : [];
    selectedListItems.value = storedItems.labels ? storedItems.labels : [];
    date.value = storedItems.date ? new Date(storedItems.date) : null;
  }

});

onUnmounted(() => {
  console.log("AAA");

})
</script>

<style scoped>
.filter-wrapper {
  min-width: 320px;
  width: 100%;
  font-family: Arial, sans-serif;
}

@media (min-width: 420px) {
  .filter-wrapper {
    width: 360px;
  }
}

@media (min-width: 768px) {
  .filter-wrapper {
    width: 510px;
  }
}

h5 {
  background: #000;
  padding: 0.6rem;
  color: #fff;
  font-weight: 800;
  margin: 0;
}

.priority-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.filter-section {
  padding: 0.8rem 0.5rem;
}

.filter-section p {
  font-size: 16px;
  font-weight: 700;
  margin: 0.5rem 0;
}
.multiselect-container .selected-item {
  display: inline-block;
  background: #000;
  /* padding: 0.01rem 0 0.03rem 0.5rem; */
  padding-left: 0.4rem !important;
  padding-right: 0.4rem !important;

  margin-left: 0.5rem;
  border: 1px solid #000;
  color: #fff;
  font-weight: 400;
  margin-bottom: 0.5rem;
  border-radius: 0.4rem;
  font-size: 0.9rem;
}

.multiselect-container .selected-item button {
  background: #fff;
  color: #000;
  border: none;
  margin-left: 0.5rem;
  margin-top: 0.3rem;
  border-radius: 4px;
  height: 1rem;
  font-size: 0.6rem;
  cursor: pointer;
  margin-bottom: 0.2rem;
}

.multiselect-container input {
  width: 100%;
  padding: 0.45rem !important;
  border: none;
  outline: none;
  border: 1px solid #b8b8b8 !important;
  border-radius: 4px;
}

.dropdown-list {
  list-style: none;
  margin-top: 0.5rem;
  padding-left: 0 !important;
}

.dropdown-list li {
  padding: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 600;
  margin-left: 0 !important;
  margin-bottom: 0.2rem;
  border-radius: 6px;
  border: 1px solid transparent;
}

.dropdown-list li:hover {
  background: #f0f0f0;
  border: 1px solid #b8b8b8;
}

.call-to-action {
  margin-bottom: 0.8rem;
}

.date-picker-wrapper {
  /* border: 1px solid #b8b8b8; */
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem;
}

.filter-title {
  display: flex;
  gap: 0.1rem;
  align-items: center;
}

.filter-title p {
  font-size: 16px;
  font-weight: 700;
  margin: 0.5rem 0.5rem !important;
}

.filter-title span {
  font-size: 12px;
  font-weight: 700;
}

.date-picker-wrapper button {
  width: 100%;
}

.btn-date-picker {
  background: #373737;
  color: #fff;
  padding: 0.4rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
}
</style>
