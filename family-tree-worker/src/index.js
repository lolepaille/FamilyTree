const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    // GET /tree  — load full tree
    if (request.method === 'GET' && url.pathname === '/tree') {
      const people = await env.DB.prepare('SELECT * FROM people').all();
      const rels   = await env.DB.prepare('SELECT * FROM relationships').all();
      return json({ people: people.results, relationships: rels.results });
    }

    // POST /tree  — full save (replace everything)
    if (request.method === 'POST' && url.pathname === '/tree') {
      const { people, relationships } = await request.json();

      await env.DB.prepare('DELETE FROM relationships').run();
      await env.DB.prepare('DELETE FROM people').run();

      for (const p of people) {
        await env.DB.prepare(
          'INSERT INTO people (id, name, email, birthYear, notes, addedBy, addedAt, editedBy, editedAt) VALUES (?,?,?,?,?,?,?,?,?)'
        ).bind(p.id, p.name, p.email ?? '', p.birthYear ?? null, p.notes ?? '', p.addedBy ?? '', p.addedAt ?? '', p.editedBy ?? null, p.editedAt ?? null).run();
      }

      for (const r of relationships) {
        await env.DB.prepare(
          'INSERT INTO relationships (fromId, toId, type) VALUES (?,?,?)'
        ).bind(r.fromId, r.toId, r.type).run();
      }

      return json({ ok: true });
    }

    return json({ error: 'Not found' }, 404);
  },
};
