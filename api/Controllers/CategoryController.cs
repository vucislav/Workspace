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
    public class CategoryController : ControllerBase
    {
        public WorkspaceContext Context { get; set; }
        public CategoryController(WorkspaceContext context)
        {
            Context = context;
        }

        [HttpPost]
        [Route("CreateCategory/{boardId}")]
        public async Task<int> CreateCategory(int boardId, [FromBody] Category c) {
            var board = await Context.Boards.FindAsync(boardId);
            c.BoardId = boardId;
            Context.Categories.Add(c);
            await Context.SaveChangesAsync();
            return c.Id;
        }

        [HttpPut]
        [Route("EditCategory/{id}")]
        public async Task<IActionResult> EditCategory(int id, [FromBody] Category c) {
            Category old = await Context.Categories.FindAsync(id);
            if (old == null) return StatusCode(404);
            old.Name = c.Name;
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }

        [HttpDelete]
        [Route("DeleteCategory/{id}")]
        public async Task<IActionResult> DeleteCategory(int id) {
            Category old = await Context.Categories.Include("Cards").FirstOrDefaultAsync(p => p.Id == id);
            if (old == null) return StatusCode(404);
            foreach (Card c in old.Cards) Context.Cards.Remove(c);
            Context.Categories.Remove(old);
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }
    }
}
