using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BoardController : ControllerBase
    {
        public WorkspaceContext Context { get; set; }
        public BoardController(WorkspaceContext context)
        {
            Context = context;
        }

        [HttpPost]
        [Route("CreateBoard")]
        public async Task<int> CreateBoard([FromBody] Board b) {
            Context.Boards.Add(b);
            await Context.SaveChangesAsync();
            return b.Id;
        }

        [HttpGet]
        [Route("GetBoards")]
        public async Task<IEnumerable<Board>> GetBoards() {
            return await Context.Boards.ToListAsync();
        }

        [HttpGet]
        [Route("GetBoard/{id}")]
        public async Task<Board> GetBoard(int id) {
            return await Context.Boards.Include("Categories.Cards").FirstOrDefaultAsync(p => p.Id == id);
        }

        [HttpPut]
        [Route("EditBoard/{id}")]
        public async Task<IActionResult> EditBoard(int id, [FromBody] Board b) {
            Board old = await Context.Boards.FindAsync(id);
            if (old == null) return StatusCode(404);
            old.Name = b.Name;
            old.Description = b.Description;
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }

        [HttpDelete]
        [Route("DeleteBoard/{id}")]
        public async Task<IActionResult> DeleteBoard(int id) {
            Board old = await Context.Boards.Include("Categories.Cards").FirstOrDefaultAsync(p => p.Id == id);
            if (old == null) return StatusCode(404);
            Context.Boards.Remove(old);
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }
    }
}
