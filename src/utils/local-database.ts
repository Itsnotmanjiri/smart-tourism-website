// Complete localStorage-based database that works exactly like Supabase
// No setup required - works instantly!

const DB_PREFIX = 'tourism_db_';

// Generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get table data from localStorage
function getTable(tableName: string): any[] {
  const data = localStorage.getItem(DB_PREFIX + tableName);
  return data ? JSON.parse(data) : [];
}

// Save table data to localStorage
function saveTable(tableName: string, data: any[]): void {
  localStorage.setItem(DB_PREFIX + tableName, JSON.stringify(data));
}

// Initialize tables if they don't exist
export function initializeLocalDatabase() {
  const tables = [
    'users', 'bookings', 'hotels', 'destinations', 'travel_buddies',
    'buddy_requests', 'carpools', 'carpool_bookings', 'chat_messages',
    'itineraries', 'expenses', 'payments', 'sos_alerts', 'reviews', 'wishlist'
  ];
  
  tables.forEach(table => {
    if (!localStorage.getItem(DB_PREFIX + table)) {
      saveTable(table, []);
    }
  });
  
  console.log('✅ Local database initialized with 15 tables');
}

// Database operations
export const localDB = {
  // SELECT
  from: (table: string) => {
    const tableData = getTable(table);
    
    return {
      select: (columns: string = '*') => {
        const selectQuery = {
          _table: table,
          _data: tableData,
          _filters: [] as Array<{column: string, op: string, value: any}>,
          
          eq: function(column: string, value: any) {
            this._filters.push({column, op: 'eq', value});
            return this;
          },
          
          ilike: function(column: string, pattern: string) {
            this._filters.push({column, op: 'ilike', value: pattern});
            return this;
          },
          
          gt: function(column: string, value: any) {
            this._filters.push({column, op: 'gt', value});
            return this;
          },
          
          limit: function(count: number) {
            const filtered = this._applyFilters();
            return {
              data: filtered.slice(0, count),
              error: null
            };
          },
          
          order: function(column: string, options: { ascending: boolean }) {
            const filtered = this._applyFilters();
            const sorted = [...filtered].sort((a, b) => {
              if (options.ascending) {
                return a[column] > b[column] ? 1 : -1;
              }
              return a[column] < b[column] ? 1 : -1;
            });
            return {
              data: sorted,
              error: null
            };
          },
          
          single: function() {
            const filtered = this._applyFilters();
            return {
              data: filtered[0] || null,
              error: filtered.length === 0 ? { code: 'PGRST116', message: 'No rows found' } : null
            };
          },
          
          _applyFilters: function() {
            let filtered = [...this._data];
            
            this._filters.forEach(filter => {
              if (filter.op === 'eq') {
                filtered = filtered.filter(row => row[filter.column] === filter.value);
              } else if (filter.op === 'ilike') {
                const searchPattern = filter.value.replace(/%/g, '').toLowerCase();
                filtered = filtered.filter(row => 
                  row[filter.column]?.toLowerCase().includes(searchPattern)
                );
              } else if (filter.op === 'gt') {
                filtered = filtered.filter(row => row[filter.column] > filter.value);
              }
            });
            
            return filtered;
          },
          
          // Terminal methods that return results
          then: async function(resolve: Function) {
            const filtered = this._applyFilters();
            resolve({ data: filtered, error: null });
          }
        };
        
        // Make it thenable (promise-like) for async/await
        (selectQuery as any).then = async function(resolve: Function) {
          const filtered = selectQuery._applyFilters();
          resolve({ data: filtered, error: null });
        };
        
        return selectQuery;
      }
    };
  },
  
  // INSERT
  insert: (table: string, records: any | any[]) => {
    return {
      select: () => {
        const data = getTable(table);
        const recordsArray = Array.isArray(records) ? records : [records];
        
        const newRecords = recordsArray.map(record => ({
          id: generateUUID(),
          ...record,
          created_at: new Date().toISOString()
        }));
        
        saveTable(table, [...data, ...newRecords]);
        
        return {
          single: () => Promise.resolve({
            data: newRecords[0],
            error: null
          }),
          then: async (resolve: Function) => {
            resolve({ data: newRecords, error: null });
          }
        };
      },
      then: async (resolve: Function) => {
        const data = getTable(table);
        const recordsArray = Array.isArray(records) ? records : [records];
        
        const newRecords = recordsArray.map(record => ({
          id: generateUUID(),
          ...record,
          created_at: new Date().toISOString()
        }));
        
        saveTable(table, [...data, ...newRecords]);
        resolve({ data: newRecords, error: null });
      }
    };
  },
  
  // UPDATE
  update: (table: string, updates: any) => ({
    eq: (column: string, value: any) => {
      return {
        select: () => {
          const data = getTable(table);
          const updated = data.map(row => 
            row[column] === value 
              ? { ...row, ...updates, updated_at: new Date().toISOString() }
              : row
          );
          saveTable(table, updated);
          
          const updatedRows = updated.filter(row => row[column] === value);
          
          return {
            single: () => Promise.resolve({
              data: updatedRows[0] || null,
              error: null
            }),
            then: async (resolve: Function) => {
              resolve({ data: updatedRows, error: null });
            }
          };
        },
        then: async (resolve: Function) => {
          const data = getTable(table);
          const updated = data.map(row => 
            row[column] === value 
              ? { ...row, ...updates, updated_at: new Date().toISOString() }
              : row
          );
          saveTable(table, updated);
          
          const updatedRows = updated.filter(row => row[column] === value);
          resolve({ data: updatedRows, error: null });
        }
      };
    }
  }),
  
  // UPSERT
  upsert: (table: string, records: any | any[], options?: any) => {
    return {
      select: () => {
        const data = getTable(table);
        const recordsArray = Array.isArray(records) ? records : [records];
        const conflictColumn = options?.onConflict || 'id';
        
        const newData = [...data];
        const upserted: any[] = [];
        
        recordsArray.forEach(record => {
          const existingIndex = newData.findIndex(
            row => row[conflictColumn] === record[conflictColumn]
          );
          
          if (existingIndex >= 0) {
            // Update existing
            newData[existingIndex] = {
              ...newData[existingIndex],
              ...record,
              updated_at: new Date().toISOString()
            };
            upserted.push(newData[existingIndex]);
          } else {
            // Insert new
            const newRecord = {
              id: generateUUID(),
              ...record,
              created_at: new Date().toISOString()
            };
            newData.push(newRecord);
            upserted.push(newRecord);
          }
        });
        
        saveTable(table, newData);
        
        return {
          single: () => Promise.resolve({
            data: upserted[0] || null,
            error: null
          }),
          then: async (resolve: Function) => {
            resolve({ data: upserted, error: null });
          }
        };
      },
      then: async (resolve: Function) => {
        const data = getTable(table);
        const recordsArray = Array.isArray(records) ? records : [records];
        const conflictColumn = options?.onConflict || 'id';
        
        const newData = [...data];
        const upserted: any[] = [];
        
        recordsArray.forEach(record => {
          const existingIndex = newData.findIndex(
            row => row[conflictColumn] === record[conflictColumn]
          );
          
          if (existingIndex >= 0) {
            newData[existingIndex] = {
              ...newData[existingIndex],
              ...record,
              updated_at: new Date().toISOString()
            };
            upserted.push(newData[existingIndex]);
          } else {
            const newRecord = {
              id: generateUUID(),
              ...record,
              created_at: new Date().toISOString()
            };
            newData.push(newRecord);
            upserted.push(newRecord);
          }
        });
        
        saveTable(table, newData);
        resolve({ data: upserted, error: null });
      }
    };
  },
  
  // DELETE
  delete: (table: string) => ({
    eq: (column: string, value: any) => {
      const data = getTable(table);
      const filtered = data.filter(row => row[column] !== value);
      saveTable(table, filtered);
      
      return Promise.resolve({
        data: null,
        error: null
      });
    }
  }),
  
  // Real-time subscriptions (simulated)
  channel: (name: string) => ({
    on: (event: string, config: any, callback: Function) => ({
      subscribe: () => {
        console.log(`📡 Subscribed to channel: ${name}`);
        (window as any)[`_subscription_${name}`] = callback;
        return {
          unsubscribe: () => {
            console.log(`📡 Unsubscribed from channel: ${name}`);
            delete (window as any)[`_subscription_${name}`];
          }
        };
      }
    })
  })
};

// Trigger real-time updates
export function triggerRealtimeUpdate(table: string, event: string, record: any) {
  const channelName = `chat-${record.carpool_id}`;
  const callback = (window as any)[`_subscription_${channelName}`];
  
  if (callback) {
    callback({ new: record });
  }
}

// Helper to clear all data
export function clearLocalDatabase() {
  const tables = [
    'users', 'bookings', 'hotels', 'destinations', 'travel_buddies',
    'buddy_requests', 'carpools', 'carpool_bookings', 'chat_messages',
    'itineraries', 'expenses', 'payments', 'sos_alerts', 'reviews', 'wishlist'
  ];
  
  tables.forEach(table => saveTable(table, []));
  console.log('🗑️ Local database cleared');
}