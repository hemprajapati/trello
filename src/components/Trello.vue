<template>
  <div class="wrapper container-fluid position-relative">
    <div v-if="error.isVisible"
      class="position-absolute d-flex justify-content-center align-items-center card error-msg">
      <h6 class="text-danger">{{ error.errorName }}</h6>
    </div>
    <div class="py-3 flex justify-content-between">
      <FilterBar @onSearch="handleSearch" @onPeopleListChange="handleUpdatePeopleFilter"
        @onCardConfig="handleCardConfig" @updateFilter="handleFilter" />
    </div>
    <div class="trello-wrapper">
      <TrelloSkeleton v-if="isLoading" />
      <div v-else class="trello-list">
        <div v-for="(element, index) in filterdData" class="trello" :key="element.id || index">
          <div class="col-12 col-sm-8 col-md-5 col-lg-3 card-list">
            <div class="p-0 d-flex heading-wrapper">
              <p class="heading flex-grow-1 mt-3 ms-3">
                {{ element.name }} 
                <span>
                  ({{ element.block.length }} )
                </span>
              </p>
              <div class="circle-wrapper" @click="element.toggle = !element.toggle">
                <div class="circle my-1"></div>
                <div v-if="element.toggle" class="card p-1 action-card position-absolute">
                  <p @click="addNewCard(element.block)" class="m-0 ps-2 py-1">
                    add new card
                  </p>
                  <p @click="deleteStep(index)" class="m-0 ps-2 py-1">
                    delete step
                  </p>
                </div>
              </div>
            </div>
            <VirstualScroller :itemList="element.block" :name="element.name" :config="cardConfig"
              @toggleField="handleToggleField" @onTextChange="handleChange" @onEnter="handleEnter"
              @onCardClose="closeCard" @onCardDelete="deleteCard" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import draggable from "vuedraggable";
import VirstualScroller from "./virstualScroller.vue";
import FilterBar from "./FilterBar.vue";
import TrelloSkeleton from "./TrelloSkeleton.vue";
const isLoading = ref(false);

export default {
  name: "Trello",
  components: { draggable, VirstualScroller, FilterBar, TrelloSkeleton }, // Add VDatePicker to components
  setup() {
    const currentHeading = ref("");
    const lists = ref([]);
    const error = reactive({
      errorName: "",
      isVisible: false,
    });
    const query = reactive({
      search: "",
      people: [],
      filters: {},
    });
    const cardConfig = ref([]);
    const createNewList = () => {
      lists.value.push({
        name: "",
        block: [],
        isFirstTimeCreated: true,
        isEditable: true,
        toggle: false,
      });
    };

    const closeCard = (args) => {
      args.isEditable = false;
      currentHeading.value = "";
    };

    const updateHeading = (args) => {
      if (currentHeading.value.length > 0) {
        args.name = currentHeading.value;
        args.isEditable = false;
        args.isFirstTimeCreated = false;
        currentHeading.value = "";
      } else {
        generateToggle("This field can't be empty");
      }
    };
    const generateToggle = (msg) => {
      error.errorName = msg;
      error.isVisible = true;
      setTimeout(() => {
        error.isVisible = false;
      }, 3000);
    };

    const addNewCard = (args) => {
      args.unshift({
        name: "",
        isEditable: true,
        isFirstTimeCreated: true,
        id: generateID(args),
      });
    };

    const handleChange = ($event) => {
      currentHeading.value = $event.target.value;
    };

    const generateID = (args) => {
      return args.length + 1;
    };

    const handleEnter = ($event, args) => {
      if ($event.keyCode === 13) {
        updateHeading(args);
      }
    };

    const deleteCard = (element, index) => {
      lists.value[index].block.splice(
        lists.value[index].block.findIndex((item) => item === element),
        1
      );
    };

    const deleteStep = (index) => {
      lists.value.splice(index, 1);
    };

    const handleToggleField = (element) => {
      element.isEditable = !element.isEditable;
      currentHeading.value = element.name;
    };
    const handleSearch = (data) => {
      query.search = data;
    };
    const handleUpdatePeopleFilter = (data) => {
      query.people = data;
    };
    const handleFilter = (data) => {
      query.filters = data;
    };
    const handleCardConfig = (data) => {
      cardConfig.value = data;
    };
    const fetchData = async () => {
      try {
        isLoading.value = true;
        const response = await axios.get("/data.json");
        lists.value = response.data.map((list) => ({
          ...list,
          isEditable: false,
          isFirstTimeCreated: false,
          toggle: false,
          block: list.blocks.map((blockItem) => ({
            ...blockItem,
            isEditable: false,
            isFirstTimeCreated: false,
          })),
        }));
      } catch (error) {
        console.error("Error fetching the data: ", error);
      }
      finally {
        isLoading.value = false;
      }
    };

    const checkFilters = () => {

      for (const key in query.filters) {
        const value = query.filters[key];
        if (Array.isArray(value) && value.length > 0) {
          return true;
        }
        if (key === "date" && value) {
          return true;
        }
      }
      return false;
    };
    const isSameDate = (date1, date2) => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    }
    const filterdData = computed(() => {
      console.log("HII");
      
      let filterData = lists.value;
      if (checkFilters()) {
        filterData = filterData.map((category) => {
          const filterBlock = category.block.filter(
            ({ priority, issueType, labels, date }) =>
              (query.filters.priorities.length > 0
                ? query.filters.priorities.includes(priority.key)
                : true) &&
              (query.filters.issueTypes.length > 0
                ? query.filters.issueTypes.includes(issueType.key)
                : true) &&
              (query.filters.labels.length > 0
                ? query.filters.labels.some((filterLabel) =>
                  labels.some(
                    (blockLabel) => blockLabel.key === filterLabel.key
                  )
                )
                : true) &&
              (query.filters.date
                ? isSameDate(new Date(query.filters.date), new Date(date))
                : true)
          );
          if (filterBlock.length) {
            return { ...category, block: filterBlock };
          }
          return { ...category, block: [] };
        });
      }
      if (query.people.length) {
        filterData = filterData.map((category) => {
          const filterBlock = category.block.filter(
            ({ assigned_to }) =>
              assigned_to &&
              assigned_to.some(({ user_id }) => query.people.includes(user_id))
          );
          if (filterBlock.length) {
            return { ...category, block: filterBlock };
          }
          return { ...category, block: [] };
        });
      }
      if (query.search.length) {
        filterData = filterData.map((category) => {
          const filteredBlocks = category.block.filter(
            (b) =>
              b.name.toLowerCase().includes(query.search.toLowerCase()) ||
              (b.assigned_to &&
                b.assigned_to.some(({ full_name }) =>
                  full_name.includes(query.search.toLowerCase())
                ))
          );
          if (filteredBlocks.length) {
            return { ...category, block: filteredBlocks };
          }
          return { ...category, block: [] };
        });
      }
      return filterData;
    });

    onMounted(() => {
      localStorage.setItem(
        "setFilters",
        JSON.stringify({
        })
      );
      fetchData();
    });
    onUnmounted(() => {
    })

    return {
      lists,
      createNewList,
      error,
      handleEnter,
      updateHeading,
      closeCard,
      handleChange,
      addNewCard,
      deleteStep,
      currentHeading,
      deleteCard,
      handleToggleField,
      handleSearch,
      handleUpdatePeopleFilter,
      handleFilter,
      cardConfig,
      handleCardConfig,
      filterdData,
      isLoading,
      query,
    };
  },
};
</script>

<style scoped>
.wrapper {
  min-height: 100vh;
}

.trello-wrapper {
  user-select: none;
  width: 100% !important;
  overflow: auto;
}

.trello-list {
  display: flex;
  width: 100%;
  gap: 1.2rem;
}

.card-list {
  width: 290px;
  box-shadow: 2px 8px 12px #fafafa;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #b8b8b8 !important;
  height: calc(100vh - 7.3rem);
  overflow-y: auto;
}

@media (min-width: 768px) {
  .card-list {
    width: 360px;
  }
}

@media (min-width: 992px) {
  .card-list {
    width: 460px;
  }
}

.flex {
  display: flex;
  gap: 3rem;
}

.heading-wrapper {
  display: flex;
  align-items: center;
  background-color: #ebebeb;
  /* height: 4px; */
  border-bottom: 1px solid #b2b2b2;
}

.heading {
  color: #4b4b4b;
  letter-spacing: 0.01vw;
  font-size: 22px !important;
  font-weight: 800;
}

.circle-wrapper {
  position: relative;
  height: 35px;
  width: 35px;
  display: flex;
  justify-items: flex-end;
  align-items: center;
  cursor: pointer;
}

.circle,
.circle::before,
.circle::after {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: #959595;
}

.circle {
  position: relative;
  display: block;
}

.circle::before {
  content: "";
  position: absolute;
  top: 0px;
  left: -8px;
}

.circle::after {
  content: "";
  top: 0px;
  left: 8px;
  position: absolute;
}

.circle-wrapper .action-card {
  top: 30px;
  right: 5px !important;
  z-index: 400;
  width: 160px;
}

.error-msg {
  width: 78vw;
  max-width: 52em;
  left: 50%;
  transform: translate(-50%);
  border: none !important;
  background-color: rgba(254, 162, 162, 0.264) !important;
}

h6 {
  letter-spacing: 0.1em;
}
</style>
