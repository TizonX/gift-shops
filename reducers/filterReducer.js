export const initialState = {
    filters: {
      category: [],
      price: [],
      brand: [],
    },
    sort: "",
    searchQuery: "",
  };
  
  export function filterReducer(state, action) {
    switch (action.type) {
      case 'TOGGLE_FILTER':
        const { filterType, value } = action.payload;
        const alreadySelected = state.filters[filterType].includes(value);
        return {
          ...state,
          filters: {
            ...state.filters,
            [filterType]: alreadySelected
              ? state.filters[filterType].filter(item => item !== value)
              : [...state.filters[filterType], value],
          },
        };
      case 'SET_SORT':
        return {
          ...state,
          sort: action.payload,
        };
      case 'SET_SEARCH_QUERY':
        return {
          ...state,
          searchQuery: action.payload,
        };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  }
  