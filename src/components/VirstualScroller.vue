<template>
  <div class="list-container" v-bind="containerProps">
    <div v-bind="wrapperProps">
      <draggable
        :list="list"
        :class="[name, 'inner-list']"
        :animation="325"
        ghost-class="ghost"
        :force-fallback="true"
        :scroll-sensitivity="150"
        :scroll-speed="40"
        :name="name"
        group="group1"
        :move="checkMove"
        @end="checkEnd"
        @start="checkStart"
      >
        <template #item="{ element }">
          <div class="card">
            <p
              v-if="config.includes('name')"
              @click="toggleField(element.data)"
              class="my-0 py-0"
            >
              {{ element.data?.name }}
            </p>
            <div class="action-menu">
              <div v-if="config.includes('assignedTo')"
               class="imge-section position-relative">
                <div
                  class="position-absolute image-item"
                  v-for="(item, index) in element.data.assigned_to.slice(0, 3)"
                  :key="item.id"
                  :style="{ left: `${index * 20}px`, zIndex: `${index * 2}` }"
                >
                  <div class="image-wrapper">
                    <img
                      :src="`/images/users/${item.image}.jpg`"
                      alt=""
                    />
                  </div>
                </div>
                <div
                  class="position-absolute image-item"
                  :style="{ left: `${3 * 20}px`, zIndex: `${4 * 2}` }"
                  v-if="element.data.assigned_to.length > 3"
                >
                  <div class="plus-sign">
                    <span> +{{ element.data.assigned_to.length - 3 }} </span>
                  </div>
                </div>
              </div>
              <div class="card-status ">
                <div  v-if="config.includes('priority')" class="priority-status">
                  <span
                    :class="{
                      critical: element.data.priority.key == 5,
                      high: element.data.priority.key == 4,
                      medium: element.data.priority.key == 3,
                      low: element.data.priority.key == 2,
                      minimal: element.data.priority.key == 1,
                    }"
                  >
                    {{ element.data.priority.label }}
                  </span>
                </div>
                <div v-if="config.includes('issueType')" class="issue-type">
                  <span> {{element.data.issueType.label}} </span>
                </div>
              </div>
            </div>
            <span class="seperator"></span>

            <div v-if="config.includes('label')"  class="label-list">
              <span v-for="(item, index) in element.data.labels" :key="index">
                {{ item.label }}
              </span>
            </div>
            <div class="p-0 issue-date">
              <Clock />
              <span >
                {{formatDate(element.data.date)}}
              </span>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
import { useVirtualList } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import Clock from "@/components/icons/Clock.vue";
import { formatDate } from "@/utils/dateUtils";

const dragItem = ref(null);
const emit = defineEmits([
  "toggleField",
  "onTextChange",
  "onEnter",
  "onCardClose",
  "onCardDelete",
  'onItemPlaceChange'
]);
const props = defineProps({
  itemList: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  config: {
    type: Array,
    required: true,
  },
});

const filteredList = computed(() => {
  return props.itemList;
});
const { list, containerProps, wrapperProps } = useVirtualList(filteredList, {
  itemHeight: 200,
  overscan: 3,
});

const checkEnd = (evt) => {
  const newIndex = evt.newIndex;
  const from = evt.from.getAttribute("class").split(" ")[0]; 
  const to = evt.to.getAttribute("class").split(" ")[0];
  const item = evt.to.__draggable_component__.list[newIndex >0 ? newIndex-1:newIndex].data;

  emit("onItemPlaceChange",
  {
    draggedTask:dragItem.value,
    sourceColumnKey:from,
    targetColumnKey:to,
    insertAfterTask:item
  }
  
)
const listContainer = document.querySelectorAll('.list-container');
listContainer.forEach((container) => {
  const hasFromClass = [...container.children].some(child => 
    child.querySelector(`.${from}`)
  );
  if(hasFromClass) {
    container.scrollTo({
      top: container.scrollTop + 2,
      behavior: 'smooth'
    });
  }
  });
  
};
const checkStart = (evt) => {
 dragItem.value = evt.item.__draggable_context.element.data;
};  
const toggleField = (data) => {
  emit("toggleField", data);
};
const handleTextChange = (e) => {
  emit("onTextChange", e);
};
const getKeyCode = (e, data) => {
  emit("onEnter", e, data);
};
const closeCard = (data) => {
  emit("onCardClose", data);
};
const deleteCard = (data, index) => {
  emit("onCardDelete", data, index);
};
</script>

<style scoped>
.list-container {
  height: calc(100vh - 13rem) !important;
  overflow-x: hidden !important;
}
.inner-list {
  height: 100%!important;
}
.card {
  border: 1px solid #b8b8b8;
  background-color: #ffffff;
  margin: 14px 6px;
  cursor: grab;
  box-shadow: 1px 2px 2px #d0d0d0;
}

.card p {
  color: #2b2b2b;
  font-weight: 600;
  font-size: 14px;
  padding: 13px !important;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden !important;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.25;
  height: 50px;
  word-spacing: normal;
}
.ghost {
  opacity: 0.4;
}

.seperator {
  display: block;
  height: 1px;
  width: 100%;
  background-color: #b8b8b87b;
}
.action-menu {
  position: relative;
  padding: 0.6rem;
  display: flex;
  justify-content: space-between;
  height: 45px;
}
.imge-section {
  display: flex;
}
.image-item {
  top: 50%;
  transform: translateY(-50%);
}
.image-wrapper,
.plus-sign {
  height: 30px;
  width: 30px;
  overflow: hidden;
  border: 2px solid #fafafa;
  border-radius: 50%;
}
.image-wrapper img {
  height: 100%;
  width: 100%;
  object-fit: fill;
}
.plus-sign {
  background-color: #959595;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  color: #fff;
  font-weight: 500;
}
.card-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  font-size: 12px;
  text-transform: capitalize;
  margin-left: auto;
}
.priority-status,
.issue-type {
}
.issue-type span,
.priority-status span {
  display: block;
  padding: 0.02rem 0.3rem;
  border-radius: 0.2rem;
   color: #fff;
   font-weight: 700;
}

.issue-type span {
  background-color: #959595;
}

.critical
{
  background-color: #920000;

}
.high {
  background-color: #fa652f;

}
.medium {
  background-color: #FFA500;

}
.low {
  background-color: #517900;

}
.minimal {
  background-color: #003b00;

}
.label-list {
  padding: 0.9rem 0.6rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.label-list span {
  display: inline-block;
  border-radius: 3px;
  padding: 0.1rem 0.4rem;
  font-size: 11px;
  font-weight: 500;
  background: #4b4b4b;
  color: #fff;
}
.issue-date {
  padding-bottom: 4px !important;
  margin: 0 8px;
  display: flex;
  font-size: 12px;
  align-items: center;
  gap: 0.5rem;
}
</style>
