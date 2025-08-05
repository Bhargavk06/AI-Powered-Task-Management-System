package com.example.todo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.todo.AssignedTask;
import com.example.todo.UserAuthentication;

@Repository
public interface AssignedTaskRepository extends JpaRepository<AssignedTask,Long> {
	List<AssignedTask> findByAssigneeId(String assigneeId);
	
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
