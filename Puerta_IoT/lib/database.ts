import { supabase } from '@/lib/supabase';

export type UserPermission = 'permanente' | 'temporal';

export type UserRecord = {
  id: string;
  numero_control: string;
  rfid: string;
  permiso: UserPermission;
  contador_entradas: number | null;
  created_at: string;
  updated_at: string;
};

export type AccessLogRecord = {
  id: string;
  rfid: string | null;
  event_type: string;
  description: string;
  created_at: string;
};

export type UserFormValues = {
  numeroControl: string;
  rfid: string;
  permiso: UserPermission;
  contadorEntradas: string;
};

const USERS_TABLE = 'usuarios';
const ACCESS_LOGS_TABLE = 'access_logs';

const normalizeRfid = (value: string) => value.trim().toUpperCase();

const formatDateISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const toIsoRange = (dateISO: string) => {
  const startDate = new Date(`${dateISO}T00:00:00`);

  if (Number.isNaN(startDate.getTime())) {
    throw new Error('Fecha inválida. Usa el formato YYYY-MM-DD.');
  }

  const nextDate = new Date(startDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return {
    start: `${dateISO}T00:00:00`,
    end: `${formatDateISO(nextDate)}T00:00:00`,
  };
};

export const formatAccessLog = (log: AccessLogRecord) => {
  const time = new Date(log.created_at).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${time} - ${log.description}`;
};

export const getUsers = async () => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as UserRecord[];
};

export const getUserByRfid = async (rfid: string) => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select('*')
    .eq('rfid', normalizeRfid(rfid))
    .maybeSingle();

  if (error) throw error;

  return data as UserRecord | null;
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase.from(USERS_TABLE).select('*').eq('id', id).maybeSingle();

  if (error) throw error;

  return data as UserRecord | null;
};

export const createUser = async (values: UserFormValues) => {
  const contadorEntradas =
    values.permiso === 'temporal' ? Number(values.contadorEntradas.trim()) : null;

  const { data, error } = await supabase
    .from(USERS_TABLE)
    .insert({
      numero_control: values.numeroControl.trim(),
      rfid: normalizeRfid(values.rfid),
      permiso: values.permiso,
      contador_entradas: values.permiso === 'temporal' ? contadorEntradas : null,
    })
    .select('*')
    .single();

  if (error) throw error;

  return data as UserRecord;
};

export const updateUser = async (id: string, values: UserFormValues) => {
  const contadorEntradas =
    values.permiso === 'temporal' ? Number(values.contadorEntradas.trim()) : null;

  const { data, error } = await supabase
    .from(USERS_TABLE)
    .update({
      numero_control: values.numeroControl.trim(),
      rfid: normalizeRfid(values.rfid),
      permiso: values.permiso,
      contador_entradas: values.permiso === 'temporal' ? contadorEntradas : null,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;

  return data as UserRecord;
};

export const deleteUser = async (id: string) => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .delete()
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;

  return data as UserRecord;
};

export const createAccessLog = async (
  description: string,
  rfid: string | null = null,
  eventType = 'manual',
) => {
  const { data, error } = await supabase
    .from(ACCESS_LOGS_TABLE)
    .insert({
      description,
      event_type: eventType,
      rfid: rfid ? normalizeRfid(rfid) : null,
    })
    .select('*')
    .single();

  if (error) throw error;

  return data as AccessLogRecord;
};

export const getAccessLogsByDate = async (dateISO: string) => {
  const { start, end } = toIsoRange(dateISO);

  const { data, error } = await supabase
    .from(ACCESS_LOGS_TABLE)
    .select('*')
    .gte('created_at', start)
    .lt('created_at', end)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as AccessLogRecord[];
};

export const getRecentAccessLogs = async (limit = 8) => {
  const { data, error } = await supabase
    .from(ACCESS_LOGS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data as AccessLogRecord[];
};