import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import { LEAVE_TYPES } from '@/data/constants';

const LeaveForm = ({ form, setForm, onSubmit, onCancel, loading }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Leave Type</label>
      <select value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required>
        {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <FormInput label="Start Date" type="date" value={form.startDate}
        onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
      <FormInput label="End Date" type="date" value={form.endDate}
        onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
      <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
        rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        placeholder="Reason for leave..." required />
    </div>
    <div className="flex justify-end gap-3 pt-2">
      <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
      <Button type="submit" loading={loading}>Submit</Button>
    </div>
  </form>
);

export default LeaveForm;
