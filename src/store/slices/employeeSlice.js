import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  employees: [],
  filterOptions: { departments: [], designations: [] },
  search: '',
  department: '',
  designation: '',
  sortBy: 'createdAt',
  order: 'desc',
  page: 1,
  pagination: { totalPages: 1, totalCount: 0, hasNextPage: false, hasPrevPage: false },
  loading: false,
  error: null,
  deletingId: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { search, department, designation, sortBy, order, page } = getState().employees;
      const { data } = await api.get('/employees', {
        params: {
          search: search || undefined,
          department: department || undefined,
          designation: designation || undefined,
          sortBy,
          order,
          page,
          limit: 10,
        },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load employees');
    }
  }
);

export const fetchFilterOptions = createAsyncThunk('employees/fetchFilters', async () => {
  const { data } = await api.get('/employees/meta/filters');
  return data;
});

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/employees/${id}`);
      dispatch(fetchEmployees());
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
    setDesignation: (state, action) => {
      state.designation = action.payload;
    },
    setSort: (state, action) => {
      const field = action.payload;
      if (state.sortBy === field) {
        state.order = state.order === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = field;
        state.order = 'asc';
      }
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetPageToOne: (state) => {
      state.page = 1;
    },
    clearFilters: (state) => {
      state.search = '';
      state.department = '';
      state.designation = '';
      state.page = 1;
    },
    clearEmployeeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
      })
      .addCase(deleteEmployee.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteEmployee.fulfilled, (state) => {
        state.deletingId = null;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload;
      });
  },
});

export const {
  setSearch,
  setDepartment,
  setDesignation,
  setSort,
  setPage,
  resetPageToOne,
  clearFilters,
  clearEmployeeError,
} = employeeSlice.actions;

export default employeeSlice.reducer;