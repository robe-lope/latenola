-- Insertar la edición Panini Mundial 2026
insert into editions (id, name, total_stickers, is_active)
values ('panini_wc_2026', 'Panini Mundial 2026', 980, true)
on conflict (id) do nothing;
