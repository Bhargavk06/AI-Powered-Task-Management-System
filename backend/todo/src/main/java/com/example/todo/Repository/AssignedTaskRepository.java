package com.example.todo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.todo.AssignedTask;
import com.example.todo.ProjectEntity;
import com.example.todo.UserAuthentication;

@Repository
public interface AssignedTaskRepository extends JpaRepository<AssignedTask,Long> {
	List<AssignedTask> findByAssigneeId(String assigneeId);
	List<AssignedTask> findByAssigneeIdAndStatusIn(String assigneeId, List<String> statuses);
	List<AssignedTask> findByProjectIdAndAssigneeId(Long projectId, String assigneeId);
	List<AssignedTask> findTasksByProject(ProjectEntity project);
	List<AssignedTask> findByAssignee(UserAuthentication user);
	
	// Find tasks assigned BY a specific user (assigner)
	List<AssignedTask> findByAssignedById(String assignedById);
	List<AssignedTask> findByAssignedByUsername(String assignedByUsername);
	
	int countByStatus(String status);
	
	@Query("SELECT COUNT(a) FROM AssignedTask a WHERE a.assignee.role = 'employee'")
	int countTasksAssignedToEmployees();

	@Query("SELECT COUNT(a) FROM AssignedTask a WHERE a.assignee.role = 'employee' AND a.status = :status")
	int countTasksByStatusForEmployees(@Param("status") String status);
	
	@Query("SELECT COUNT(a) FROM AssignedTask a WHERE a.assignee.role = 'manager'")
	int countTasksAssignedToManagers();

	@Query("SELECT COUNT(a) FROM AssignedTask a WHERE a.assignee.role = 'manager' AND a.status = :status")
	int countTasksByStatusForManagers(@Param("status") String status);


}
