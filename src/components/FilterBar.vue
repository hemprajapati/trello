<template>
  <div class="filter-box-wrapper position-relative">
    <div class="left-section">
      <input
        v-model="searchparams"
        class="input-search-box"
        @input="handleInput($event)"
        placeholder="search your task here..."
      />
      <div class="filter-list-person d-flex position-relative">
        <div
          class="img-wrapper position-absolute"
          v-for="(item, index) in imgList"
          :key="index"
          :class="{ checked: isChecked(item.id) }"
          :style="{ left: `${index * 27}px`, zIndex: `${index * 2}` }"
        >
          <input
            type="checkbox"
            class="image-checkbox"
            @change="handleCheck($event, item.id)"
          />
          <img :src="item.src" />
        </div>
      </div>
    </div>
    <div class="right-section">
      <div class="filter-layout">
        <button class="btn-filter" @click="toggleDropdown('filter')">
          <span>
            <Filter />
          </span>
        </button>
        <button class="btn-list-check" @click="toggleDropdown('list')">
          <ListCheck />
        </button>
      </div>
      <div
        v-if="activeDropdown === 'filter'"
        class="dropdown-wrapper position-absolute"
      >
      <FilterList 
      @onCancle="handleCancle"
      @save="handleSave"
      />
      </div>
      <div
        v-if="activeDropdown === 'list'"
        class="dropdown-wrapper position-absolute"
      >
        <div class="list-wrapper">
            <h5>Layout Configration</h5>
          <div
            class="list-items"
          >
          <label class="custom-checkbox" v-for="(item, index) in layoutStructure" :key="index">
            <input type="checkbox" :value="item.key"
            v-model="listItems" />
            <span class="checkmark"></span>
            {{ item.label }}
          </label>
            
          </div>
          <div class="call-to-action">
            <button class="btn-cancel" @click="cancleConfig"> Cancel </button>
            <button class="btn-apply" @click="applyConfig"> Apply </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, provide, ref } from "vue";
import img1 from "@/assets/images/users/user1.jpg";
import img2 from "@/assets/images/users/user2.jpg";
import img3 from "@/assets/images/users/user3.jpg";
import img4 from "@/assets/images/users/user4.jpg";
import img5 from "@/assets/images/users/user5.jpg";
import img6 from "@/assets/images/users/user6.jpg";
import img7 from "@/assets/images/users/user7.jpg";
import img8 from "@/assets/images/users/user8.jpg";
import img9 from "@/assets/images/users/user9.jpg";
import img10 from "@/assets/images/users/user10.jpg";
import Filter from "./icons/filter.vue";
import ListCheck from "./icons/ListCheck.vue";
import FilterList from "./FilterList.vue";

const activeDropdown = ref(null);
const selectedConfig = ref([]);

const emit = defineEmits(["onSearch", "onPeopleListChange","onCardConfig",'updateFilter']);
const searchparams = ref("");
const imgList = ref([
  {
    id: 1,
    src: img1,
  },
  {
    id: 2,
    src: img2,
  },
  {
    id: 3,
    src: img3,
  },
  {
    id: 4,
    src: img4,
  },
  {
    id: 5,
    src: img5,
  },
  {
    id: 6,
    src: img6,
  },
  {
    id: 7,
    src: img7,
  },
  {
    id: 8,
    src: img8,
  },
  {
    id: 9,
    src: img9,
  },
  {
    id: 10,
    src: img10,
  },
]);
const layoutStructure = [
  {
    key: "date",
    label: "Due Date",
  },
  {
    key: "name",
    label: "name",
  },
  {
    key: "assignedTo",
    label: "Assigned To",
  },
  {
    key: "priority",
    label: "Priority",
  },
  {
    key: "issueType",
    label: "Issue type",
  },
  {
    key: "label",
    label: "Label",
  },
];
const checkedItem = ref([]);
const listItems = ref(['name','assignedTo','priority','issueType','label']);


const handleCancle = () =>{
    activeDropdown.value = null
}
const handleSave = (data) =>{
    activeDropdown.value = null
    emit("updateFilter",data)
}
const cancleConfig = () =>{
    activeDropdown.value = null
}
const applyConfig = () =>{
  emit("onCardConfig", listItems.value );
  activeDropdown.value =null
}
let timeoutId;

const handleCheck = (e, id) => {
  if (e.target.checked) {
    checkedItem.value.push(id);
  } else {
    checkedItem.value = checkedItem.value.filter((i) => i !== id);
  }
  clearTimeout(timeoutId);
  timeoutId = setTimeout(()=> emit("onPeopleListChange", checkedItem.value), 1500);
};
const isChecked = (id) => {
  return checkedItem.value.includes(id);
};

const handleInput = (e) => {
  const value = e.target.value;
  searchparams.value = value.replace(/[^a-zA-Z0-9]/g, "");
  clearTimeout(timeoutId);
  timeoutId = setTimeout(()=> emit("onSearch", searchparams.value), 1500);
};
const toggleDropdown = (type) => {
  activeDropdown.value = activeDropdown.value === type ? null : type;
};
onMounted(() => {
  emit("onCardConfig", listItems.value )

})
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
const search = ref("");
const calendar = ref(null);
</script>

<style scoped>
.filter-box-wrapper {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.right-section {
  margin-top: 5px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.4rem;
}

.right-section svg:hover {
  cursor: pointer;
}

.input-search-box {
  border: 1px solid #b8b8b8 !important;
  border-radius: 8px;
  width: 96%;
  padding: 6px !important;
  font-weight: 700;
  color: #262626;
}
@media (min-width: 768px) {
    .input-search-box  {
        width: 360px;
  }
}
.filter-list-person {
  flex-shrink: 0;
  height: 45px;
}

.filter-layout {
  display: flex;
  justify-content: space-between;
  height: 30px;
  width: 90px;
}

@media (min-width: 786px) {
  .filter-box-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .left-section {
    flex-direction: row;
  }

  .input-search-box {
    max-width: 420px;
  }

  .filter-list-person {
    margin-top: 5px;
    height: 45px;
  }
}

@media (min-width: 992px) {
  .input-search-box {
    max-width: 660px;
  }
}

.filter-list-person .img-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fafafa;
  transition: transform 0.4s ease-in;
}

.checked {
  top: 5px;
  width: 35px !important;
  height: 35px !important;
}

.filter-list-person .img-wrapper:hover {
  transform: scale(1.1);
  z-index: 50 !important;
}

.filter-list-person .img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.user-dropdown {
  width: 85px;
  border: 1px solid red;
}

.checkbox {
  z-index: 500;
  position: relative;
}

.image-checkbox,
.list-checkbox {
  position: absolute;
  background: none;
  cursor: pointer;
  outline: 0;
  padding: 0 !important;
  height: 100%;
  width: 100%;
  -webkit-appearance: none;
  opacity: 0.5;
  z-index: 600;
}

.image-checkbox:checked {
  background-color: #242323b1 !important;
  backdrop-filter: blur(2px);
  opacity: 1;
}

.image-checkbox:checked::before {
  content: "";
  position: absolute;
  right: 55%;
  top: 50%;
  width: 8px;
  height: 22px;
  border: solid #fff;
  border-width: 0 2px 3px 0;
  margin: -2px 1px 0 -1px;
  transform: rotate(45deg) translate(-55%, -50%);
  z-index: 2;
}

.btn-filter,
.btn-list-check {
  outline: none;
  border: none;
  background: #262626;
  height: 35px;
  width: 40px;
  border-radius: 6px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dropdown-wrapper {
  border: 1px solid #b8b8b8;
  top: 50px;
  width: auto;
  right: 0;
  z-index: 60;
  background-color: #fff;
  box-shadow: 4px 4px 12px #b8b8b8;
  border-radius: 4px;
}



.list-wrapper {
  width: 320px;
  padding: 0 0 0.6rem;
overflow: hidden;
}
.list-wrapper h5{
  background: #000000;
  padding: 0.6rem;
  color: #fff;
  font-weight: 800;
}
.list-checkbox {
 opacity: 1;
}
.list-checkbox::before {
  position: absolute;
  content: "";
  height: 25px;
  width: 25px;
  border: 2px solid #000000;
}
.list-items-checked .list-checkbox:checked::before {
  content: "";
  position: absolute;
  width: 8px;
  top: 12px;
  left: 8px;
  height: 22px;
  border: 2px solid #000000;
  border-width: 0 2px 3px 0;
  margin: -2px 1px 0 -1px;
  transform: rotate(45deg) translate(-55%, -50%);
  z-index: 2;
}
.list-items {
  position: relative;
  padding: 6px;
  margin: 1px; 
}
.list-items span {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
}
</style>
